package aptech.library.management.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import aptech.library.management.models.Author;
import aptech.library.management.repositories.AuthorRepository;


@Controller
@RequestMapping("/author")
public class AuthorController {

    @Autowired
    private AuthorRepository authorRepository;

    @GetMapping("/list")
    public String listAuthors(Model theModel) {
        List < Author > theAuthors = authorRepository.getAuthors();
        theModel.addAttribute("authors", theAuthors);
        return "list-author";
    }

    @GetMapping("/showForm")
    public String showFormForAdd(Model theModel) {
    	Author theAuthor = new Author();
        theModel.addAttribute("author", theAuthor);
        return "author-form";
    }

    @PostMapping("/saveAuthor")
    public String saveAuthor(@ModelAttribute("author") Author theAuthor) {
        authorRepository.saveAuthor(theAuthor);
        return "redirect:/author/list";
    }

    @GetMapping("/updateForm")
    public String showFormForUpdate(@RequestParam("authorId") int theId,
        Model theModel) {
        Author theAuthor = authorRepository.getAuthor(theId);
        theModel.addAttribute("author", theAuthor);
        return "author-form";
    }

    @GetMapping("/delete")
    public String deleteAuthor(@RequestParam("authorId") int theId) {
        authorRepository.deleteAuthor(theId);
        return "redirect:/author/list";
    }
}