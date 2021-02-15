package aptech.library.management.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import aptech.library.management.models.Book;
import aptech.library.management.models.LostBook;
import aptech.library.management.repositories.BookRepository;
import aptech.library.management.repositories.LostBookRepository;
import aptech.library.management.viewmodels.BaseResult;
import aptech.library.management.viewmodels.ErrorResult;
import aptech.library.management.viewmodels.SuccessResult;

@Controller
@RequestMapping("/lost-book")
public class LostBookController {

	@Autowired
	private LostBookRepository lostBookRepository;

	@Autowired
	private BookRepository bookRepository;

	@GetMapping("")
	public String Index() {
		return "lost-book";
	}

	@PostMapping("/list")
	@ResponseBody
	public BaseResult List() {
		try {
			List<LostBook> theLostBook = lostBookRepository.getLostBooks();
			return new SuccessResult(theLostBook);
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}

	@PostMapping("/save")
	@ResponseBody
	public BaseResult SaveLostBook(@RequestBody LostBook lostBook) {
		try {
			int amount =lostBook.getQuantity();
			if(lostBook.getId()!=0){
				LostBook existLostBook=	lostBookRepository.getLostBook(lostBook.getId());
				if(existLostBook!=null){
					amount-=existLostBook.getQuantity();
				}
			}
			Book book =bookRepository.getBook(lostBook.getBookId());
			if(!bookRepository.isValidQuantity(lostBook.getBookId(), amount))
			return new ErrorResult("The lost book quantity must be less or equal than "+book.getQuantity()+"the current book quantity in library!");
		
			lostBookRepository.saveLostBook(lostBook);
			if(lostBook.getId()>0)
			return new SuccessResult();
			else
			return new ErrorResult();
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}

	@PostMapping("/delete")
	@ResponseBody
	public BaseResult DeleteLostBook(@RequestBody LostBook book) {
		try {
			boolean deleted = lostBookRepository.deleteLostBook(book.getId());
			if(deleted)
			return new SuccessResult();
			else
			return new ErrorResult();
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}
}
