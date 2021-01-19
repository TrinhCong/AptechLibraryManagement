package aptech.library.management.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {
	@RequestMapping("/home")
	public String Index() {
		return "home";
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