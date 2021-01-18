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

import aptech.library.management.models.Author;
import aptech.library.management.repositories.AuthorRepository;
import aptech.library.management.repositories.AuthorRepository;
import aptech.library.management.viewmodels.BaseResult;
import aptech.library.management.viewmodels.ErrorResult;
import aptech.library.management.viewmodels.SuccessResult;

@Controller
@RequestMapping("/author")
public class AuthorController {

	@Autowired
	private AuthorRepository authorRepository;

	@GetMapping("")
	public String index() {
		return "author";
	}

	@PostMapping("/list")
	@ResponseBody
	public BaseResult listAuthors() {
		try {
			List<Author> theAuthor = authorRepository.getAuthors();
			return new SuccessResult(theAuthor);
		} catch (Exception ex) {
			return new ErrorResult("Error system");
		}
	}

	@PostMapping("/create")
	@ResponseBody
	public BaseResult createAuthor(@RequestBody Author author) {
		try {
			authorRepository.saveAuthor(author);
			return new SuccessResult(author);
		} catch (Exception ex) {
			return new ErrorResult("Error system");
		}
	}

	@PostMapping("/delete")
	@ResponseBody
	public BaseResult deleteAuthor(@RequestBody Author author) {
		try {
			boolean authorDeleted = authorRepository.deleteAuthor(author.getId());
			return new SuccessResult(authorDeleted);
		} catch (Exception ex) {
			return new ErrorResult("Error system");
		}
	}
}
