package aptech.library.management.models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "borrowing_books")
public class BorrowingBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "book_id")
	private int bookId;
    
    @Column(name = "borrowed_at")
    private Date borrowedAt;

    @Column(name = "returned_at")
	private Date returnedAt;
    
    @Column(name = "expirated_at")
	private Date expiratedAt;
    
    @Column(name = "returned")
	private int returned;
	
    @Column(name = "rental")
    private double rental;
	
	
    public int getReturned() {
		return returned;
	}

	public void setReturned(int returned) {
		this.returned = returned;
	}

	@Column(name = "quantity")
	private int quantity;

    @Column(name = "note")
	private String note;
	
	@OneToOne
    @JoinColumn(name = "id")
	private User user;
	
	@OneToOne
    @JoinColumn(name = "id")
	private Book book;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public int getBookId() {
		return bookId;
	}

	public void setBookId(int bookId) {
		this.bookId = bookId;
	}

	public Date getBorrowedAt() {
		return borrowedAt;
	}

	public void setBorrowedAt(Date borrowedAt) {
		this.borrowedAt = borrowedAt;
	}

	public Date getReturnedAt() {
		return returnedAt;
	}

	public void setReturnedAt(Date returnedAt) {
		this.returnedAt = returnedAt;
	}



	public Date getExpiratedAt() {
		return expiratedAt;
	}

	public void setExpiratedAt(Date expiratedAt) {
		this.expiratedAt = expiratedAt;
	}

	public double getRental() {
		return rental;
	}

	public void setRental(double rental) {
		this.rental = rental;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Book getBook() {
		return book;
	}

	public void setBook(Book book) {
		this.book = book;
	}
	
    
}