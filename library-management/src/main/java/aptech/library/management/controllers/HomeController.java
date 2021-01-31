package aptech.library.management.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {
	@RequestMapping("/admin-page")
	public String Admin() {
		return "admin-page";
	}
	@RequestMapping("/user-page")
	public String User() {
		return "user-page";
	}
	@RequestMapping("/forbiden-page")
	public String Forbiden() {
		return "forbiden-page";
	}
	@RequestMapping("/")
	public String NavigateSlash() {
		return "redirect:/user/login";
	}
	@RequestMapping("")
	public String Navigate() {
		return "redirect:/user/login";
	}
}