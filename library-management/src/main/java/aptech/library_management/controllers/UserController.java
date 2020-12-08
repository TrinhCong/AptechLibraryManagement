package aptech.library_management.controllers;

import java.util.List;

import aptech.library_management.models.User;
import aptech.library_management.repositories.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/person/")
public class UserController {
	
	private static final Logger logger = LoggerFactory.getLogger(UserController.class);

	@Autowired
	private UserRepository userRepository;
	
	@RequestMapping(method=RequestMethod.GET,value="edit")
	public ModelAndView editPerson(@RequestParam(value="id",required=false) Long id) {		
		logger.debug("Received request to edit person id : "+id);				
		ModelAndView mav = new ModelAndView();		
 		mav.setViewName("edit");
 		User user = null;
 		if (id == null) {
 			user = new User();
 		} else {
 			user = userRepository.find(id);
 		}
 		
 		mav.addObject("person", user);
		return mav;
		
	}
	
	@RequestMapping(method=RequestMethod.POST,value="edit") 
	public String savePerson(@ModelAttribute User user) {
		logger.debug("Received postback on person "+user);		
		userRepository.save(user);
		return "redirect:list";
		
	}
	
	@RequestMapping(method=RequestMethod.GET,value="list")
	public ModelAndView listPeople() {
		logger.debug("Received request to list persons");
		ModelAndView mav = new ModelAndView();
		List<User> people = userRepository.getPeople();
		logger.debug("Person Listing count = "+people.size());
		mav.addObject("people",people);
		mav.setViewName("list");
		return mav;
		
	}

}
