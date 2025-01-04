using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.src.Infrastructure.Helpers
{
    public static class ErrorCodes
    {
        public const string BadRequest = "400";
        public const string NotFound = "404";
        public const string InternalServerError = "500";
        public const string Unauthorized = "401";
    }

}