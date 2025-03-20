using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

public class BusDbContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<BusRoute> BusRoutes { get; set; }
    public DbSet<OrderHistory> OrderHistories { get; set; }
    public DbSet<Bonus> Bonuses { get; set; }
    public DbSet<Booking> Bookings { get; set; } 

    public BusDbContext(DbContextOptions<BusDbContext> options)
        : base(options)
    { }
}

public class ApplicationUser : IdentityUser
{
    public string? FullName { get; set; }
}

public class OrderHistory
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Route { get; set; }
    public string Status { get; set; }

    public ApplicationUser User { get; set; }

    public OrderHistory(string userId, DateTime orderDate, decimal totalAmount, string route, string status, ApplicationUser user)
    {
        UserId = userId;
        OrderDate = orderDate;
        TotalAmount = totalAmount;
        Route = route;
        Status = status;
        User = user; 
    }
}

public class Bonus
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public int BonusPoints { get; set; }

    public ApplicationUser User { get; set; }

    public Bonus(string userId, int bonusPoints, ApplicationUser user)
    {
        UserId = userId;
        BonusPoints = bonusPoints;
        User = user; 
    }
}

public class BusRoute
{
    public string? Origin { get; set; }
    public string? Destination { get; set; }
    public string? Route { get; set; }
}

public class Booking
{
    public int Id { get; set; }  
    public string? Route { get; set; }  
    public int PassengerCount { get; set; }  
    public DateTime Date { get; set; }  
}
