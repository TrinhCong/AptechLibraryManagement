package aptech.library.management.repositories;
import java.util.List;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import aptech.library.management.models.Author;


 interface IAuthorRepository {

    public List < Author > getAuthors();

    public void saveAuthor(Author theAuthor);

    public Author getAuthor(int theId);

    public void deleteAuthor(int theId);
}

@Repository
@Transactional
public class AuthorRepository implements IAuthorRepository {

    @Autowired
    private SessionFactory sessionFactory;

    public List < Author > getAuthors() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < Author > cq = cb.createQuery(Author.class);
        Root < Author > root = cq.from(Author.class);
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();
    }

    public void deleteAuthor(int id) {
        Session session = sessionFactory.getCurrentSession();
        Author book = session.byId(Author.class).load(id);
        session.delete(book);
    }

    public void saveAuthor(Author theAuthor) {
        Session currentSession = sessionFactory.getCurrentSession();
        currentSession.saveOrUpdate(theAuthor);
    }

    public Author getAuthor(int theId) {
        Session currentSession = sessionFactory.getCurrentSession();
        Author theAuthor = currentSession.get(Author.class, theId);
        return theAuthor;
    }
}