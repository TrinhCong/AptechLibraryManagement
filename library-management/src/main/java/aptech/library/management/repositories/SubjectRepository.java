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

import aptech.library.management.models.Subject;

interface ISubjectRepository {

	public List<Subject> getSubjects();

	public void saveSubject(Subject theSubject);

	public Subject getSubject(int theId);

	public boolean deleteSubject(int theId);
}

@Repository
public class SubjectRepository implements ISubjectRepository {

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


	public List<Subject> getSubjects() {
		Session session = openSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<Subject> cq = cb.createQuery(Subject.class);
		Root<Subject> root = cq.from(Subject.class);
		cq.select(root);
		Query query = session.createQuery(cq);
		return query.getResultList();
	}

	public boolean deleteSubject(int id) {
		Session session = openSession();
		Transaction transaction = session.beginTransaction();
		Subject subject = session.byId(Subject.class).load(id);
		if (subject != null) {
			session.delete(subject);
			transaction.commit();
			return true;
		}
		return false;
	}

	
	public boolean isExist(Subject theSubject){
		List<Subject> subjects=getSubjects();
		for(Subject subject:subjects){
			if(subject.getId()!=theSubject.getId()&&subject.getName().trim().equals(theSubject.getName().trim()))
			return true;
		}
		return false;
	}
	public void saveSubject(Subject theSubject) {
		Session session = openSession();
		if (theSubject.getId() == 0) {
			session.saveOrUpdate(theSubject);
		} else {
			Subject subjectExists = session.byId(Subject.class).load(theSubject.getId());
			if (subjectExists != null) {
				Transaction transaction = session.beginTransaction();
				subjectExists.setDescription(theSubject.getDescription());
				subjectExists.setName(theSubject.getName());
				session.saveOrUpdate(subjectExists);
				transaction.commit();
			}
		}
	}

	public Subject getSubject(int theId) {
		Session session = openSession();
		Subject theSubject = session.get(Subject.class, theId);
		return theSubject;
	}
}