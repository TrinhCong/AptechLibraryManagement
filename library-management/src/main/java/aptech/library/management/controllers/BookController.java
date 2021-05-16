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

import aptech.library.management.models.Book;
import aptech.library.management.repositories.BookRepository;
import aptech.library.management.viewmodels.BaseResult;
import aptech.library.management.viewmodels.ErrorResult;
import aptech.library.management.viewmodels.SuccessResult;

@Controller
@RequestMapping("/book")
public class BookController {

	@Autowired
	private BookRepository bookRepository;

	@GetMapping("")
	public String Index() {
		return "book";
	}

	@GetMapping("/list")
	@ResponseBody
	public BaseResult List(boolean onlyAvailable) {
		try {
			List<Book> theBooks = bookRepository.getBooks();

			if(onlyAvailable)
			theBooks= theBooks.stream()
				.filter(x -> x.getQuantity()>0).collect(Collectors.toList());
			return new SuccessResult(theBooks);
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}


	@PostMapping("/save")
	@ResponseBody
	public BaseResult SaveBook(@RequestBody Book book) {
		try {
			if(bookRepository.isExist(book))
				return new ErrorResult("Book code already exist!");
			bookRepository.saveBook(book);
			if(book.getId()>0)
			return new SuccessResult();
			else
			return new ErrorResult();
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}

	@PostMapping("/delete")
	@ResponseBody
	public BaseResult DeleteBook(@RequestBody Book book) {
		try {
			boolean deleted = bookRepository.deleteBook(book.getId());
			if(deleted)
			return new SuccessResult();
			else
			return new ErrorResult();
		} catch (Exception ex) {
			return new ErrorResult("This book is in use and cannot be deleted!");
		}
	}
}
