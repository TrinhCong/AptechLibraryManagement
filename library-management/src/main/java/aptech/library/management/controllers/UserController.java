package aptech.library.management.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import aptech.library.management.models.User;
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
	public String Index() {
		return "user";
	}

	@GetMapping("/login")
	public String Login() {
		return "login";
	}

	@PostMapping("/login")
	@ResponseBody
	public BaseResult Login(@RequestBody User model) {
		
		User exist = userRepository.getUsers().stream()
				.filter(x -> x.getUserName().equalsIgnoreCase(model.getUserName())
						&& userRepository.checkPassword(model.getPassword(), x.getPassword()))
				.findFirst().orElse(null);
		if (exist != null)
			return new SuccessResult(exist);
		return new ErrorResult();
	}

	@PostMapping("/list")
	@ResponseBody
	public BaseResult List(int excludeId) {
		try {
			List<User> theUsers = userRepository.getUsers();
			if (excludeId > 0)
				theUsers = theUsers.stream().filter(x -> x.getId() != excludeId).collect(Collectors.toList());
			return new SuccessResult(theUsers);
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}

	@PostMapping("/save")
	@ResponseBody
	public BaseResult SaveUser(@RequestBody User user) {
		try {
			if (userRepository.isExist(user))
				return new ErrorResult("The user name already exist!");
			userRepository.saveUser(user);
			if (user.getId() > 0)
				return new SuccessResult();
			else
				return new ErrorResult();
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}

	@PostMapping("/delete")
	@ResponseBody
	public BaseResult DeleteUser(@RequestBody User user) {
		try {
			boolean deleted = userRepository.deleteUser(user.getId());
			if (deleted)
				return new SuccessResult();
			else
				return new ErrorResult();
		} catch (Exception ex) {
			return new ErrorResult("This subject is in use and cannot be deleted!");
		}
	}
}
