using AngularAuthAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AngularAuthAPI.UtilityService
{
    public interface IEmailService
    {
        void sendEmail(EmailModel emailModel);
    }
}
