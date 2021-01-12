package aptech.library.management.viewmodels;

public class ErrorResult extends BaseResult {
	public ErrorResult() {
		success=true;
	}
	public ErrorResult(String message) {
		success=true;
		this.message=message;
	}
}
