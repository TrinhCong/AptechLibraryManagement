package aptech.library.management.controllers;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import aptech.library.management.models.LostBook;
import aptech.library.management.repositories.BookRepository;
import aptech.library.management.repositories.BorrowingBookRepository;
import aptech.library.management.repositories.DamagedBookRepository;
import aptech.library.management.repositories.LostBookRepository;
import aptech.library.management.viewmodels.BaseResult;
import aptech.library.management.viewmodels.ErrorResult;
import aptech.library.management.viewmodels.StatisticIndicator;
import aptech.library.management.viewmodels.SuccessResult;

@Controller
@RequestMapping("/statistic")
public class StatisticController {

	@Autowired
	private BookRepository bookRepository;

	@Autowired
	private LostBookRepository lostBookRepository;

	@Autowired
	private DamagedBookRepository damageBookRepository;

	@Autowired
	private BorrowingBookRepository borrowingBookRepository;
	
	@GetMapping("")
	public String Index() {
		return "statistic";
	}
	

	@PostMapping("/list")
	@ResponseBody
	public BaseResult List() {
		try {
			List<StatisticIndicator> indicators=new ArrayList<StatisticIndicator>();
			
			//
			StatisticIndicator totalIndicator=new StatisticIndicator();
			totalIndicator.setName("Book Total");
			totalIndicator.setColor("success");
			totalIndicator.setPercent(100.0);
			double total=bookRepository.getBooks().stream().mapToInt(o -> o.getQuantity()).sum();
			totalIndicator.setTotal((int)total);
			indicators.add(totalIndicator);
		
			//
			StatisticIndicator bIndicator=new StatisticIndicator();
			bIndicator.setName("Borrowing Book");
			bIndicator.setColor("warning");
			double bTotal=borrowingBookRepository.getBorrowingBooks().stream().mapToInt(o -> o.getQuantity()).sum();
			bIndicator.setPercent(bTotal/total*100.0);
			bIndicator.setTotal((int)bTotal);
			indicators.add(bIndicator);
			
			//
			StatisticIndicator dIndicator=new StatisticIndicator();
			dIndicator.setName("Damaged Book");
			dIndicator.setColor("danger");
			double dTotal=damageBookRepository.getDamagedBooks().stream().mapToInt(o -> o.getQuantity()).sum();
			dIndicator.setPercent(dTotal/total*100.0);
			dIndicator.setTotal((int)dTotal);
			indicators.add(dIndicator);
			
			//
			StatisticIndicator lIndicator=new StatisticIndicator();
			lIndicator.setName("Lost Book");
			lIndicator.setColor("danger");
			double lTotal=lostBookRepository.getLostBooks().stream().mapToInt(o -> o.getQuantity()).sum();
			lIndicator.setPercent(lTotal/total*100.0);
			lIndicator.setTotal((int)lTotal);
			indicators.add(lIndicator);
			
			return new SuccessResult(indicators);
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}
}
