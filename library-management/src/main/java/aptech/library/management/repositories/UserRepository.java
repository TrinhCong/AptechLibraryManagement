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
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import aptech.library.management.models.User;

interface IUserRepository {

	public List<User> getUsers();

	public void saveUser(User theUser);

	public User getUser(int theId);

	public boolean deleteUser(int theId);
}

@Repository
public class UserRepository implements IUserRepository {

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
    
     private int workload = 12;
	public  String hashPassword(String password) {
		String salt = BCrypt.gensalt(workload);
		String hashed_password = BCrypt.hashpw(password, salt);
		return hashed_password;
	}

	public  boolean checkPassword(String password, String hashPassword) {
		boolean password_verified = false;
		if(null != password &&hashPassword.startsWith("$2a$"))
			password_verified = BCrypt.checkpw(password, hashPassword);
		return(password_verified);
	}


	public List<User> getUsers() {
		Session session = openSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<User> cq = cb.createQuery(User.class);
		Root<User> root = cq.from(User.class);
		cq.select(root);
		Query query = session.createQuery(cq);
		return query.getResultList();
	}

	public boolean deleteUser(int id) {
		Session session = openSession();
		Transaction transaction = session.beginTransaction();
		User user = session.byId(User.class).load(id);
		if (user != null) {
			session.delete(user);
			transaction.commit();
			return true;
		}
		return false;
	}
	
	public boolean isExist(User theUser){
		List<User> users=getUsers();
		for(User user:users){
			if(user.getId()!=theUser.getId()&&user.getUserName().trim().equals(theUser.getUserName().trim()))
			return true;
		}
		return false;
	}

	public void saveUser(User theUser) {
		Session session = openSession();
		theUser.setPassword(hashPassword(theUser.getPassword()));
		if (theUser.getId() == 0) {
			theUser.setBirthDate(new Date());
			session.saveOrUpdate(theUser);
		} else {
			User userExists = session.byId(User.class).load(theUser.getId());

			if (userExists != null) {
				Transaction transaction = session.beginTransaction();
				userExists.setAddress(theUser.getAddress());
				userExists.setBirthDate(theUser.getBirthDate());
				userExists.setDisplayName(theUser.getDisplayName());
				userExists.setGender(theUser.getGender());
				userExists.setPassword(theUser.getPassword());
				userExists.setUserName(theUser.getUserName());
				userExists.setRole(theUser.getRole());
				session.saveOrUpdate(userExists);
				transaction.commit();
			}
		}
	}

	public User getUser(int theId) {
		Session session = openSession();
		User theUser = session.get(User.class, theId);
		return theUser;
	}
}