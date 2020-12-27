package aptech.library.management.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
 
@Controller
@RequestMapping("/home")
public class HomeController {

    @GetMapping("/index")
    public String Index(Model model) {
        
        model.addAttribute("greeting", "Hello Spring MVC");
        
        return "home";
        
    }
 
}