package aptech.library.management.viewmodels;

public class ErrorResult extends BaseResult {
	public ErrorResult() {
		success=false;
	}
	public ErrorResult(String message) {
		success=false;
		this.message=message;
	}
}
