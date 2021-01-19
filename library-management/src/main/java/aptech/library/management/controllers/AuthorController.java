package aptech.library.management.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import aptech.library.management.models.Author;
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
	public String Index() {
		return "author";
	}

	@PostMapping("/list")
	@ResponseBody
	public BaseResult List() {
		try {
			List<Author> theAuthor = authorRepository.getAuthors();
			return new SuccessResult(theAuthor);
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}

	@PostMapping("/save")
	@ResponseBody
	public BaseResult SaveAuthor(@RequestBody Author author) {
		try {
			if(authorRepository.isExist(author))
			return new ErrorResult("Author Name already exist!");
			authorRepository.saveAuthor(author);
			if(author.getId()>0)
			return new SuccessResult();
			else
			return new ErrorResult();
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}

	@PostMapping("/delete")
	@ResponseBody
	public BaseResult DeleteAuthor(@RequestBody Author author) {
		try {
			boolean deleted = authorRepository.deleteAuthor(author.getId());
			if(deleted)
			return new SuccessResult();
			else
			return new ErrorResult();
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}
}
