package aptech.library.management.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import aptech.library.management.models.User;
import aptech.library.management.repositories.AuthorRepository;
import aptech.library.management.repositories.UserRepository;
import aptech.library.management.viewmodels.BaseResult;
import aptech.library.management.viewmodels.ErrorResult;
import aptech.library.management.viewmodels.SuccessResult;

@Controller
@RequestMapping("/user")
public class UserController {

	@Autowired
	private UserRepository userRepository;

	@GetMapping("")
	public String index() {
		return "user";
	}
	@GetMapping("/login")
	public String login() {
		return "login";
	}

	@PostMapping("/list")
	@ResponseBody
	public BaseResult listUsers() {
		try {
			List<User> theUser = userRepository.getUsers();
			return new SuccessResult(theUser);
		} catch (Exception ex) {
			return new ErrorResult("Error system");
		}
	}

	@PostMapping("/create")
	@ResponseBody
	public BaseResult createUser(@RequestBody User user) {
		try {
			userRepository.saveUser(user);
			return new SuccessResult(user);
		} catch (Exception ex) {
			return new ErrorResult("Error system");
		}
	}

	@PostMapping("/delete")
	@ResponseBody
	public BaseResult deleteUser(@RequestBody User user) {
		try {
			boolean userDeleted = userRepository.deleteUser(user.getId());
			return new SuccessResult(userDeleted);
		} catch (Exception ex) {
			return new ErrorResult("Error system");
		}
	}
}
