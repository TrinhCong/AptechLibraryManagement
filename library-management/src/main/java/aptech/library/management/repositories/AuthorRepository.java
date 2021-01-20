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

import aptech.library.management.models.Author;

interface IAuthorRepository {

	public List<Author> getAuthors();

	public void saveAuthor(Author theAuthor);

	public Author getAuthor(int theId);

	public boolean deleteAuthor(int theId);
}

@Repository
public class AuthorRepository implements IAuthorRepository {

	@Autowired
	private SessionFactory sessionFactory;

	public Session openSession() {
		Session session;

		try {
			session = sessionFactory.getCurrentSession();
		} catch (HibernateException e) {
			session = sessionFactory.openSession();
		}
		return session;
	}

	public List<Author> getAuthors() {
		Session session = openSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<Author> cq = cb.createQuery(Author.class);
		Root<Author> root = cq.from(Author.class);
		cq.select(root);
		Query query = session.createQuery(cq);
		return query.getResultList();
	}

	public boolean deleteAuthor(int id) {
		Session session = openSession();
		Transaction transaction = session.beginTransaction();
		Author author = session.byId(Author.class).load(id);
		if (author != null) {
			session.delete(author);
			transaction.commit();
			return true;
		}
		return false;
	}
	
	public boolean isExist(Author theAuthor){
		List<Author> authors=getAuthors();
		for(Author author:authors){
			if(author.getId()!=theAuthor.getId()&&author.getName().trim().equals(theAuthor.getName().trim()))
			return true;
		}
		return false;
	}

	public void saveAuthor(Author theAuthor) {
		Session session = openSession();
		if (theAuthor.getId() == 0) {
			session.saveOrUpdate(theAuthor);
		} else {
			Author authorExists = session.byId(Author.class).load(theAuthor.getId());
			if (authorExists != null) {
				Transaction transaction = session.beginTransaction();
				authorExists.setDescription(theAuthor.getDescription());
				authorExists.setName(theAuthor.getName());
				session.saveOrUpdate(authorExists);
				transaction.commit();
			}
		}
	}

	public Author getAuthor(int theId) {
		Session session = openSession();
		Author theAuthor = session.get(Author.class, theId);
		return theAuthor;
	}
}