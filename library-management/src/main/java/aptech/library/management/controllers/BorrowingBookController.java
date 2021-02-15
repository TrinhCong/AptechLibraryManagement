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
import aptech.library.management.models.BorrowingBook;
import aptech.library.management.repositories.BookRepository;
import aptech.library.management.repositories.BorrowingBookRepository;
import aptech.library.management.viewmodels.BaseResult;
import aptech.library.management.viewmodels.ErrorResult;
import aptech.library.management.viewmodels.SuccessResult;

@Controller
@RequestMapping("/borrowing-book")
public class BorrowingBookController {

	@Autowired
	private BorrowingBookRepository borrowingBookRepository;

	@Autowired
	private BookRepository bookRepository;

	@GetMapping("")
	public String Index() {
		return "borrowing-book";
	}

	@PostMapping("/list")
	@ResponseBody
	public BaseResult List() {
		try {
			List<BorrowingBook> theBorrowingBook = borrowingBookRepository.getBorrowingBooks();
			return new SuccessResult(theBorrowingBook);
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}

	@PostMapping("/save")
	@ResponseBody
	public BaseResult SaveBorrowingBook(@RequestBody BorrowingBook borrowingBook) {
		try {
			int amount =borrowingBook.getQuantity();
			if(borrowingBook.getId()!=0){
				BorrowingBook existBorrowingBook=	borrowingBookRepository.getBorrowingBook(borrowingBook.getId());
				if(existBorrowingBook!=null){
					amount-=existBorrowingBook.getQuantity();
				}
			}
			Book book =bookRepository.getBook(borrowingBook.getBookId());
			if(!bookRepository.isValidQuantity(borrowingBook.getBookId(), amount))
			return new ErrorResult("The borrowing book quantity must be less or equal than "+book.getQuantity()+"the current book quantity in library!");
		
			borrowingBookRepository.saveBorrowingBook(borrowingBook);
			if(borrowingBook.getId()>0)
			return new SuccessResult();
			else
			return new ErrorResult();
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}

	@PostMapping("/delete")
	@ResponseBody
	public BaseResult DeleteBorrowingBook(@RequestBody BorrowingBook book) {
		try {
			boolean deleted = borrowingBookRepository.deleteBorrowingBook(book.getId());
			if(deleted)
			return new SuccessResult();
			else
			return new ErrorResult();
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}
}
