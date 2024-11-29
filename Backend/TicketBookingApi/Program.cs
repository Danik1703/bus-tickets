var builder = WebApplication.CreateBuilder(args);

// Добавляем сервисы в контейнер
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularOrigins", builder =>
    {
        builder.WithOrigins("http://localhost:4200") 
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});
builder.Services.AddControllers(); 

var app = builder.Build();

// Конфигурация HTTP pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); 
}

app.UseHttpsRedirection();
app.UseCors("AllowAngularOrigins"); 


app.MapGet("/busschedule", () =>
{
    var busSchedules = Enumerable.Range(1, 5).Select(index =>
        new BusSchedule(
            RouteNumber: Random.Shared.Next(100, 999), 
            DepartureLocation: "City " + Random.Shared.Next(1, 5), /
            DestinationLocation: "City " + Random.Shared.Next(6, 10), 
            DepartureTime: DateTime.Now.AddHours(Random.Shared.Next(1, 24)) 
        ))
        .ToArray();

    return busSchedules;
})
.WithName("GetBusSchedule");

app.Run();


record BusSchedule(int RouteNumber, string DepartureLocation, string DestinationLocation, DateTime DepartureTime);
