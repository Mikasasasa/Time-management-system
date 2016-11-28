using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Http.Description;
using TimeManagementSystem.API;
using TimeManagementSystem.API.Models;

namespace TimeManagementSystem.API.Controllers
{
    public class TimeRecordsController : ApiController
    {
        private AuthContext db = new AuthContext();

        // GET: api/TimeRecords
		[Authorize]
		[ResponseType(typeof(IList<TimeRecord>))]
		public IHttpActionResult GetTimeRecors() {
			var identity = (ClaimsIdentity)User.Identity;
			IEnumerable<Claim> claims = identity.Claims;

			var role = claims.FirstOrDefault(claim => claim.Type == "role").Value;
			var userId = claims.FirstOrDefault(claim => claim.Type == "userId").Value;
			if (getPermissionLevel(role) == PermissionLevel.Regular) {
				return Ok(db.TimeRecors.Where(tr => tr.UserId == userId).OrderBy(tr => tr.StartDate));
			} else if (getPermissionLevel(role) == PermissionLevel.Administrator) {
				return Ok(db.TimeRecors.OrderBy(tr => tr.StartDate));
			} else {
				return Unauthorized();
			}
        }

        // GET: api/TimeRecords/5
        [ResponseType(typeof(TimeRecord))]
		[Authorize]
        public IHttpActionResult GetTimeRecord(int id) {
			var identity = (ClaimsIdentity)User.Identity;
			IEnumerable<Claim> claims = identity.Claims;

			var role = claims.FirstOrDefault(claim => claim.Type == "role").Value;
			var userId = claims.FirstOrDefault(claim => claim.Type == "userId").Value;

			var permissionLevel = getPermissionLevel(role);

			if (permissionLevel == PermissionLevel.UserManager || permissionLevel == PermissionLevel.Undefined) {
				return Unauthorized();
			}

			TimeRecord timeRecord = db.TimeRecors.Find(id);

			if (timeRecord == null) {
				return NotFound();
			}

			if (permissionLevel == PermissionLevel.Regular && userId != timeRecord.UserId) {
				return Unauthorized();
			} else {
				return Ok(timeRecord);
			}
        }

        // PUT: api/TimeRecords/5
        [ResponseType(typeof(void))]
		[Authorize]
        public IHttpActionResult PutTimeRecord(int id, TimeRecord timeRecord) {
			var identity = (ClaimsIdentity)User.Identity;
			IEnumerable<Claim> claims = identity.Claims;

			var role = claims.FirstOrDefault(claim => claim.Type == "role").Value;
			var userId = claims.FirstOrDefault(claim => claim.Type == "userId").Value;

			var permissionLevel = getPermissionLevel(role);

			if (permissionLevel == PermissionLevel.UserManager || permissionLevel == PermissionLevel.Undefined) {
				return Unauthorized();
			}

			if (permissionLevel == PermissionLevel.Regular && userId != timeRecord.UserId) {
				return Unauthorized();
			}

			if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != timeRecord.Id)
            {
                return BadRequest();
            }

            db.Entry(timeRecord).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TimeRecordExists(id))
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

        // POST: api/TimeRecords
        [ResponseType(typeof(TimeRecord))]
		[Authorize]
        public IHttpActionResult PostTimeRecord(TimeRecord timeRecord)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
			}
			var identity = (ClaimsIdentity)User.Identity;
			IEnumerable<Claim> claims = identity.Claims;
			
			var userId = claims.FirstOrDefault(claim => claim.Type == "userId").Value;

			timeRecord.UserId = userId;

			db.TimeRecors.Add(timeRecord);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = timeRecord.Id }, timeRecord);
        }

        // DELETE: api/TimeRecords/5
        [ResponseType(typeof(TimeRecord))]
		[Authorize]
        public IHttpActionResult DeleteTimeRecord(int id) {
			var identity = (ClaimsIdentity)User.Identity;
			IEnumerable<Claim> claims = identity.Claims;

			var role = claims.FirstOrDefault(claim => claim.Type == "role").Value;
			var userId = claims.FirstOrDefault(claim => claim.Type == "userId").Value;

			var permissionLevel = getPermissionLevel(role);

			if (permissionLevel == PermissionLevel.UserManager || permissionLevel == PermissionLevel.Undefined) {
				return Unauthorized();
			}

			TimeRecord timeRecord = db.TimeRecors.Find(id);

			if (timeRecord == null) {
				return NotFound();
			}

			if (permissionLevel == PermissionLevel.Regular && userId != timeRecord.UserId) {
				return Unauthorized();
			}
			else {

				db.TimeRecors.Remove(timeRecord);
				db.SaveChanges();
				return Ok(timeRecord);
			}
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TimeRecordExists(int id)
        {
            return db.TimeRecors.Count(e => e.Id == id) > 0;
		}

		private PermissionLevel getPermissionLevel(string roleId) {
			switch (roleId) {
				case "0":
					return PermissionLevel.Regular;
				case "1":
					return PermissionLevel.UserManager;
				case "2":
					return PermissionLevel.Administrator;
				default:
					return PermissionLevel.Undefined;
			}
		}
	}
}