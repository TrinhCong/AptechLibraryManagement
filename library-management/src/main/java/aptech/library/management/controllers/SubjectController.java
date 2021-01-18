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

import aptech.library.management.models.Subject;
import aptech.library.management.repositories.SubjectRepository;
import aptech.library.management.repositories.SubjectRepository;
import aptech.library.management.viewmodels.BaseResult;
import aptech.library.management.viewmodels.ErrorResult;
import aptech.library.management.viewmodels.SuccessResult;

@Controller
@RequestMapping("/subject")
public class SubjectController {

	@Autowired
	private SubjectRepository subjectRepository;

	@GetMapping("")
	public String index() {
		return "subject";
	}

	@PostMapping("/list")
	@ResponseBody
	public BaseResult listSubjects() {
		try {
			List<Subject> theSubject = subjectRepository.getSubjects();
			return new SuccessResult(theSubject);
		} catch (Exception ex) {
			return new ErrorResult("Error system");
		}
	}

	@PostMapping("/create")
	@ResponseBody
	public BaseResult createSubject(@RequestBody Subject subject) {
		try {
			subjectRepository.saveSubject(subject);
			return new SuccessResult(subject);
		} catch (Exception ex) {
			return new ErrorResult("Error system");
		}
	}

	@PostMapping("/delete")
	@ResponseBody
	public BaseResult deleteSubject(@RequestBody Subject subject) {
		try {
			boolean subjectDeleted = subjectRepository.deleteSubject(subject.getId());
			return new SuccessResult(subjectDeleted);
		} catch (Exception ex) {
			return new ErrorResult("Error system");
		}
	}
}
