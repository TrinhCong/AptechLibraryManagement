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
import aptech.library.management.models.DamagedBook;

interface IDamagedBookRepository {

	public List<DamagedBook> getDamagedBooks();

	public void saveDamagedBook(DamagedBook theDamagedBook);

	public DamagedBook getDamagedBook(int theId);

	public boolean deleteDamagedBook(int theId);
}

@Repository
public class DamagedBookRepository implements IDamagedBookRepository {

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

	public List<DamagedBook> getDamagedBooks() {
		Session session = openSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<DamagedBook> cq = cb.createQuery(DamagedBook.class);
		Root<DamagedBook> root = cq.from(DamagedBook.class);
		cq.select(root);
		Query query = session.createQuery(cq);
		List<DamagedBook> books= query.getResultList();
		for(DamagedBook book : books) {
			book.setBook(bookRepository.getBook(book.getBookId()));
		}
		return books;
	}

	public boolean deleteDamagedBook(int id) {
		Session session = openSession();
		Transaction transaction = session.beginTransaction();
		DamagedBook book = session.byId(DamagedBook.class).load(id);
		if (book != null) {
			session.delete(book);
			transaction.commit();
			bookRepository.increaseQuantity(book.getBookId(), book.getQuantity());
			return true;
		}
		return false;
	}
	

	public void saveDamagedBook(DamagedBook theDamagedBook) {
		Session session = openSession();
		theDamagedBook.setUpdatedAt(new Date());
		int minusBook=theDamagedBook.getQuantity();
		if (theDamagedBook.getId() == 0) {
			session.saveOrUpdate(theDamagedBook);
		} else {
			DamagedBook bookExists = session.byId(DamagedBook.class).load(theDamagedBook.getId());
			if (bookExists != null) {
				minusBook-=bookExists.getQuantity();
				Transaction transaction = session.beginTransaction();
				bookExists.setBookId(theDamagedBook.getBookId());
				bookExists.setQuantity(theDamagedBook.getQuantity());
				bookExists.setReason(theDamagedBook.getReason());
				bookExists.setUpdatedAt(new Date());
				session.saveOrUpdate(bookExists);
				transaction.commit();
			}
		}

		bookRepository.increaseQuantity(theDamagedBook.getBookId(), -minusBook);
	}

	public DamagedBook getDamagedBook(int theId) {
		Session session = openSession();
		DamagedBook theDamagedBook = session.get(DamagedBook.class, theId);
		return theDamagedBook;
	}
}