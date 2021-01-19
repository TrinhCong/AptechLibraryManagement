package aptech.library.management.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import aptech.library.management.models.DamagedBook;
import aptech.library.management.repositories.DamagedBookRepository;
import aptech.library.management.viewmodels.BaseResult;
import aptech.library.management.viewmodels.ErrorResult;
import aptech.library.management.viewmodels.SuccessResult;

@Controller
@RequestMapping("/damaged-book")
public class DamagedBookController {

	@Autowired
	private DamagedBookRepository bookRepository;

	@GetMapping("")
	public String Index() {
		return "damaged-book";
	}

	@PostMapping("/list")
	@ResponseBody
	public BaseResult List() {
		try {
			List<DamagedBook> theDamagedBook = bookRepository.getDamagedBooks();
			return new SuccessResult(theDamagedBook);
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}

	@PostMapping("/save")
	@ResponseBody
	public BaseResult SaveDamagedBook(@RequestBody DamagedBook book) {
		try {
			bookRepository.saveDamagedBook(book);
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
	public BaseResult DeleteDamagedBook(@RequestBody DamagedBook book) {
		try {
			boolean deleted = bookRepository.deleteDamagedBook(book.getId());
			if(deleted)
			return new SuccessResult();
			else
			return new ErrorResult();
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}
}
