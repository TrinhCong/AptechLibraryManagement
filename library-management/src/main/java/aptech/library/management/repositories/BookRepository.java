package aptech.library.management.repositories;

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

interface IBookRepository {

	public List<Book> getBooks();

	public void saveBook(Book theBook);

	public Book getBook(int theId);

	public boolean deleteBook(int theId);
	
	public void  increaseQuantity(int bookId,int amount) ;
}

@Repository
public class BookRepository implements IBookRepository {

	@Autowired
	private SessionFactory sessionFactory;

	@Autowired
	private AuthorRepository authorRepository;

	@Autowired
	private SubjectRepository subjectRepository;

	public Session openSession() {
		Session session;

		try {
			session = sessionFactory.getCurrentSession();
		} catch (HibernateException e) {
			session = sessionFactory.openSession();
		}
		return session;
	}

	public List<Book> getBooks() {
		Session session = openSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<Book> cq = cb.createQuery(Book.class);
		Root<Book> root = cq.from(Book.class);
		cq.select(root);
		Query query = session.createQuery(cq);
		List<Book> books= query.getResultList();
		for(Book book : books) {
			book.setAuthor(authorRepository.getAuthor(book.getAuthorId()));
			book.setSubject(subjectRepository.getSubject(book.getSubjectId()));
		}
		return books;
	}

	
	public boolean isExist(Book theBook){
		List<Book> books=getBooks();
		for(Book book:books){
			if(book.getId()!=theBook.getId()&&book.getCode().trim().equals(theBook.getCode().trim()))
			return true;
		}
		return false;
	}
	public boolean deleteBook(int id) {
		Session session = openSession();
		Transaction transaction = session.beginTransaction();
		Book book = session.byId(Book.class).load(id);
		if (book != null) {
			session.delete(book);
			transaction.commit();
			return true;
		}
		return false;
	}

	public void saveBook(Book theBook) {
		Session session = openSession();
		if (theBook.getId() == 0) {
			session.saveOrUpdate(theBook);
		} else {
			Book bookExists = session.byId(Book.class).load(theBook.getId());

			if (bookExists != null) {
				Transaction transaction = session.beginTransaction();
				bookExists.setCode(theBook.getCode());
				bookExists.setTitle(theBook.getTitle());
				bookExists.setDescription(theBook.getDescription());
				bookExists.setRentPrice(theBook.getRentPrice());
				bookExists.setQuantity(theBook.getQuantity());
				bookExists.setSubjectId(theBook.getSubjectId());
				session.saveOrUpdate(bookExists);
				transaction.commit();
			}
		}
	}

	public Book getBook(int theId) {
		Session session = openSession();
		Book theBook = session.get(Book.class, theId);
		return theBook;
	}
	
	public void increaseQuantity(int bookId,int amount) {
		if(amount!=0&&bookId!=0){
			Book theBook= getBook(bookId);
			if(theBook!=null) {
				theBook.setQuantity(theBook.getQuantity()+amount);
				saveBook(theBook);
			}
		}
	}
	
	public boolean isValidQuantity(int bookId, int amount) {
		if(amount!=0&&bookId!=0){
			Book theBook= getBook(bookId);;
			if(theBook!=null) {
			return theBook.getQuantity()>=amount;
			}
		}
		if(amount==0)
			return true;
		return false;
	}
	
}