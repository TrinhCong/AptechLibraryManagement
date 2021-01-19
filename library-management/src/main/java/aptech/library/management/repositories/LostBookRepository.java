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

import aptech.library.management.models.Book;
import aptech.library.management.models.LostBook;

interface ILostBookRepository {

	public List<LostBook> getLostBooks();

	public void saveLostBook(LostBook theLostBook);

	public LostBook getLostBook(int theId);

	public boolean deleteLostBook(int theId);
}

@Repository
public class LostBookRepository implements ILostBookRepository {

	@Autowired
	private SessionFactory sessionFactory;

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

	public List<LostBook> getLostBooks() {
		Session session = openSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<LostBook> cq = cb.createQuery(LostBook.class);
		Root<LostBook> root = cq.from(LostBook.class);
		cq.select(root);
		Query query = session.createQuery(cq);
		List<LostBook> books= query.getResultList();
		for(LostBook book : books) {
			book.setBook(bookRepository.getBook(book.getBookId()));
		}
		return books;
	}

	public boolean deleteLostBook(int id) {
		Session session = openSession();
		Transaction transaction = session.beginTransaction();
		LostBook book = session.byId(LostBook.class).load(id);
		if (book != null) {
			session.delete(book);
			transaction.commit();
			bookRepository.increaseQuantity(book.getBookId(), book.getQuantity());
			return true;
		}
		return false;
	}
	

	public void saveLostBook(LostBook theLostBook) {
		Session session = openSession();
		theLostBook.setUpdatedAt(new Date());
		int minusBook=theLostBook.getQuantity();
		if (theLostBook.getId() == 0) {
			session.saveOrUpdate(theLostBook);
		} else {
			LostBook bookExists = session.byId(LostBook.class).load(theLostBook.getId());
			if (bookExists != null) {
				minusBook-=bookExists.getQuantity();
				Transaction transaction = session.beginTransaction();
				bookExists.setBookId(theLostBook.getBookId());
				bookExists.setQuantity(theLostBook.getQuantity());
				bookExists.setReason(theLostBook.getReason());
				bookExists.setUpdatedAt(new Date());
				session.saveOrUpdate(bookExists);
				transaction.commit();
			}
		}

		bookRepository.increaseQuantity(theLostBook.getBookId(), -minusBook);
	}

	public LostBook getLostBook(int theId) {
		Session session = openSession();
		LostBook theLostBook = session.get(LostBook.class, theId);
		return theLostBook;
	}
}