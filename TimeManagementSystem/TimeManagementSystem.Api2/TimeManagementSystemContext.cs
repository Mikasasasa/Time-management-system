using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using TimeManagementSystem.API.Models;

namespace TimeManagementSystem.API
{
    public class TimeManagementSystemContext : DbContext
    {
		public DbSet<User> Users { get; set; }
		public DbSet<TimeRecord> TimeRecors { get; set; }
	}
}
