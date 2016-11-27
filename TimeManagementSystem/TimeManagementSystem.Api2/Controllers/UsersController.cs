using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using TimeManagementSystem.API;
using TimeManagementSystem.API.Models;

namespace TimeManagementSystem.API.Controllers
{
    public class UsersController : ApiController
    {
        private TimeManagementSystemContext db = new TimeManagementSystemContext();

        // GET: api/Users
        public IList<User> GetUsers()
        {
            return db.Users.ToList();
        }

        // GET: api/Users/5
        [ResponseType(typeof(User))]
        public IHttpActionResult GetUser(int id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
		}

		[ResponseType(typeof(User))]
		public IHttpActionResult GetUser(string login, string password) {
			User user = db.Users.FirstOrDefault(u => u.Login == login && u.Password == password);
			if (user == null) {
				return NotFound();
			}

			return Ok(user);
		}

		// PUT: api/Users/5
		[ResponseType(typeof(void))]
        public IHttpActionResult PutUser(int id, User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != user.Id)
            {
                return BadRequest();
			}

			if (UserExists(user.Id, user.Login)) {
				return BadRequest(ModelState);
			}

			db.Entry(user).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Users
        [ResponseType(typeof(User))]
        public IHttpActionResult PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

			if (UserExists(user.Login)) {
				return BadRequest(ModelState);
			}

            db.Users.Add(user);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [ResponseType(typeof(User))]
        public IHttpActionResult DeleteUser(int id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            db.Users.Remove(user);
            db.SaveChanges();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int id)
        {
            return db.Users.Count(e => e.Id == id) > 0;
		}

		private bool UserExists(string login) {
			return db.Users.Count(e => e.Login == login) > 0;
		}

		private bool UserExists(int id, string login) {
			return db.Users.Count(e => e.Login == login && e.Id != id) > 0;
		}
	}
}