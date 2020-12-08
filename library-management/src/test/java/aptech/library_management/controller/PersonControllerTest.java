package aptech.library_management.controller;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.List;

import aptech.library_management.controllers.UserController;
import aptech.library_management.models.User;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.ModelAndView;

@ContextConfiguration("/test-context.xml")
@RunWith(SpringJUnit4ClassRunner.class)
@Transactional
public class PersonControllerTest {
	
	@Autowired
	private DataInitializer dataInitializer;
	
	@Autowired
	private UserController userController;
		
	@Before
	public void before() {
		dataInitializer.initData();
	}
	
	@Test
	public void shouldReturnPersonListView() {
		ModelAndView mav = userController.listPeople();
		assertEquals("list",mav.getViewName());
		
		@SuppressWarnings("unchecked")
		List<User> people = (List<User>) mav.getModelMap().get("people");
		assertNotNull(people);		
		assertEquals(DataInitializer.PERSON_COUNT,people.size());		
	}
	
	

	public void shouldReturnNewPersonWithEditMav() {
		ModelAndView mav = userController.editPerson(null);
		assertNotNull(mav);
		assertEquals("edit", mav.getViewName());
		Object object = mav.getModel().get("person");
		assertTrue(User.class.isAssignableFrom(object.getClass()));
		User user = (User) object;
		assertNull(user.getId());
		assertNull(user.getFirstName());
		assertNull(user.getLastName());		
	}
	
	@Test
	public void shouldReturnSecondPersonWithEditMav() {
		Long template = dataInitializer.people.get(1);
		ModelAndView mav = userController.editPerson(template);
		assertNotNull(mav);
		assertEquals("edit", mav.getViewName());
		Object object = mav.getModel().get("person");
		assertTrue(User.class.isAssignableFrom(object.getClass()));
		User user = (User) object;
		assertEquals(template,user.getId());
	}
	
}
