package aptech.library.management.repositories;

import java.util.Date;
import java.util.List;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import aptech.library.management.models.BorrowingBook;

interface IBorrowingBookRepository {

	public List<BorrowingBook> getBorrowingBooks();

	public void saveBorrowingBook(BorrowingBook theBorrowingBook);

	public BorrowingBook getBorrowingBook(int theId);

	public boolean deleteBorrowingBook(int theId);
}

@Repository
public class BorrowingBookRepository implements IBorrowingBookRepository {

	@Autowired
	private SessionFactory sessionFactory;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private BookRepository bookRepository;

	public Session openSession() {
		Session session;

		try {
			session = sessionFactory.getCurrentSession();
		} catch (HibernateException e) {
			session = sessionFactory.openSession();
		}
		return session;
	}

	public List<BorrowingBook> getBorrowingBooks() {
		Session session = openSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<BorrowingBook> cq = cb.createQuery(BorrowingBook.class);
		Root<BorrowingBook> root = cq.from(BorrowingBook.class);
		cq.select(root);
		Query query = session.createQuery(cq);
		List<BorrowingBook> books= query.getResultList();
		for(BorrowingBook book : books) {
			book.setUser(userRepository.getUser(book.getUserId()));
			book.setBook(bookRepository.getBook(book.getBookId()));
		}
		return books;
	}
	

	public boolean deleteBorrowingBook(int id) {
		Session session = openSession();
		Transaction transaction = session.beginTransaction();
		BorrowingBook book = session.byId(BorrowingBook.class).load(id);
		if (book != null) {
			session.delete(book);
			transaction.commit();
			bookRepository.increaseQuantity(book.getBookId(), book.getQuantity());
			return true;
		}
		return false;
	}
	

	public void saveBorrowingBook(BorrowingBook theBorrowingBook) {
		Session session = openSession();
		int minusBook=theBorrowingBook.getQuantity();
		if (theBorrowingBook.getId() == 0) {
			theBorrowingBook.setBorrowedAt(new Date());
			session.saveOrUpdate(theBorrowingBook);
		} else {
			BorrowingBook bookExists = session.byId(BorrowingBook.class).load(theBorrowingBook.getId());

			if (bookExists != null) {
				Transaction transaction = session.beginTransaction();
				boolean oldReturned=bookExists.getReturnedAt()!=null;
				boolean newReturned=theBorrowingBook.getReturnedAt()!=null;
				
				if(oldReturned!=newReturned) {
					if(newReturned){
						bookRepository.increaseQuantity(theBorrowingBook.getBookId(), theBorrowingBook.getQuantity());
						bookExists.setReturnedAt(new Date());
					}
					else {
						bookExists.setReturnedAt(null);
						minusBook-=bookExists.getQuantity();
					}
				}
				else {
					minusBook-=bookExists.getQuantity();
				}
				bookExists.setUserId(theBorrowingBook.getUserId());
				bookExists.setBookId(theBorrowingBook.getBookId());
				bookExists.setQuantity(theBorrowingBook.getQuantity());
				bookExists.setRental(theBorrowingBook.getRental());
				bookExists.setNote(theBorrowingBook.getNote());
				session.saveOrUpdate(bookExists);
				transaction.commit();
			}

		}

		bookRepository.increaseQuantity(theBorrowingBook.getBookId(), -minusBook);
	}

	public BorrowingBook getBorrowingBook(int theId) {
		Session session = openSession();
		BorrowingBook theBorrowingBook = session.get(BorrowingBook.class, theId);
		return theBorrowingBook;
	}
}