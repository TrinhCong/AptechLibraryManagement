package aptech.library_management.repositories;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import aptech.library_management.models.User;

@Repository
public class UserRepository {

	@PersistenceContext
	private EntityManager entityManager;
	
	public User find(Long id) {
		return entityManager.find(User.class, id);
	}
	
	@SuppressWarnings("unchecked")
	public List<User> getPeople() {
		return entityManager.createQuery("select p from Person p").getResultList();
	}
	
	@Transactional
	public User save(User user) {
		if (user.getId() == null) {
			entityManager.persist(user);
			return user;
		} else {
			return entityManager.merge(user);
		}		
	}	
	
}
