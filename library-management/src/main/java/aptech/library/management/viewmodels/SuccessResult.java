package aptech.library.management.viewmodels;

public class SuccessResult extends BaseResult {
	public SuccessResult() {
		success=true;
	}
	public SuccessResult(String message) {
		success=true;
		this.message=message;
	}
	public SuccessResult(Object data) {
		success=true;
		this.data=data;
	}
	public SuccessResult(String message, Object data) {
		success=true;
		this.message=message;
		this.data=data;
	}
}
