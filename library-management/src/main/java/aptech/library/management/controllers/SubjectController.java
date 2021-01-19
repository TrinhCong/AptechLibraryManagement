package aptech.library.management.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import aptech.library.management.models.Subject;
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
	public String Index() {
		return "subject";
	}

	@PostMapping("/list")
	@ResponseBody
	public BaseResult List() {
		try {
			List<Subject> theSubject = subjectRepository.getSubjects();
			return new SuccessResult(theSubject);
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}

	@PostMapping("/save")
	@ResponseBody
	public BaseResult SaveSubject(@RequestBody Subject subject) {
		try {
			if(subjectRepository.isExist(subject))
			return new ErrorResult("The subject name already exist!");
			subjectRepository.saveSubject(subject);
			if(subject.getId()>0)
			return new SuccessResult();
			else
			return new ErrorResult();
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}

	@PostMapping("/delete")
	@ResponseBody
	public BaseResult DeleteSubject(@RequestBody Subject subject) {
		try {
			boolean deleted = subjectRepository.deleteSubject(subject.getId());
			if(deleted)
			return new SuccessResult();
			else
			return new ErrorResult();
		} catch (Exception ex) {
			return new ErrorResult("An error has occured! Please try later!");
		}
	}
}
