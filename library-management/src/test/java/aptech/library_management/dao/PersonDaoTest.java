package aptech.library_management.dao;

import java.util.List;

import aptech.library_management.controller.DataInitializer;
import aptech.library_management.models.User;
import aptech.library_management.repositories.UserRepository;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

@ContextConfiguration("/test-context.xml")
@RunWith(SpringJUnit4ClassRunner.class)
@Transactional
public class PersonDaoTest {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private DataInitializer dataInitializer;

	@Before
	public void prepareData() {
		dataInitializer.initData();
	}

	@Test
	public void shouldSaveAPerson() {
		User p = new User();
		p.setFirstName("Andy");
		p.setLastName("Gibson");
		userRepository.save(p);
		Long id = p.getId();
		Assert.assertNotNull(id);
	}

	@Test
	public void shouldLoadAPerson() {
		Long template = dataInitializer.people.get(0);
		User p = userRepository.find(template);

		Assert.assertNotNull("Person not found!", p);
		Assert.assertEquals(template, p.getId());
	}

	public void shouldListPeople() {
		List<User> people = userRepository.getPeople();
		Assert.assertEquals(DataInitializer.PERSON_COUNT, people.size());

	}

}
