import api from "./api";

class VolunteerService {
  // Register a new volunteer
  async registerVolunteer(volunteerData) {
    try {
      const response = await api.post(
        "/VolunteerRegistration/VolunteerRegistration",
        volunteerData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get available locations (mock data for now)
  async getLocations() {
    // Mock data - replace with actual API call when backend is ready
    return [
      { id: 1, name: "Math Circle - Onsite (Agoura)" },
      { id: 2, name: "Math Circle - Virtual Training" },
      { id: 3, name: "Engineering Circle - Virtual Training" },
      { id: 4, name: "SAT/PSAT - Virtual Training" },
      { id: 5, name: "ACT - Virtual Training" },
      { id: 6, name: "Math Circle - Hybrid (Agoura + Virtual)" },
      { id: 7, name: "Engineering Circle - Onsite (Agoura)" },
      { id: 8, name: "Test Preparation - Onsite (Agoura)" },
    ];
  }

  // Get session options (mock data for now)
  async getSessions() {
    return [
      { id: "F2024", name: "Fall Session 2024" },
      { id: "S2025", name: "Spring Session 2025" },
      { id: "F2025", name: "Fall Session 2025" },
    ];
  }

  // Get grade options (mock data for now)
  async getGrades() {
    return [
      { value: "High School Freshman", label: "9" },
      { value: "10", label: "10" },
      { value: "11", label: "11" },
      { value: "12", label: "12" },
      { value: "UG", label: "UG" },
      { value: "Graduate", label: "Graduate" },
      { value: "PhD", label: "PhD" },
      { value: "Others", label: "Others" },
    ];
  }

  // Get interested options (mock data for now)
  async getInterestedOptions() {
    return [
      { value: "0", label: "--Select--" },
      { value: "Tutoring", label: "Tutoring" },
      { value: "Document Review", label: "Document Reviewer" },
      { value: "Class Coordinator", label: "Class Coordinator" },
      { value: "Facility Inspection", label: "Facility Inspection" },
      { value: "Grading", label: "Grading" },
      { value: "Yard Duty", label: "Yard Duty" },
      { value: "Others", label: "Others" },
    ];
  }

  // Get countries (mock data for now)
  async getCountries() {
    return [
      { value: "US", label: "United States" },
      { value: "CA", label: "Canada" },
      { value: "GB", label: "United Kingdom" },
      { value: "CN", label: "China" },
      { value: "IN", label: "India" },
      { value: "SG", label: "Singapore" },
      { value: "MX", label: "Mexico" },
      { value: "MY", label: "Malaysia" },
      { value: "AF", label: "Afghanistan" },
      { value: "AL", label: "Albania" },
      { value: "DZ", label: "Algeria" },
      { value: "AS", label: "American Samoa" },
      { value: "AD", label: "Andorra" },
      { value: "AO", label: "Angola" },
      { value: "AI", label: "Anguilla" },
      { value: "AQ", label: "Antarctica" },
      { value: "AG", label: "Antigua And Barbuda" },
      { value: "AR", label: "Argentina" },
      { value: "AM", label: "Armenia" },
      { value: "AW", label: "Aruba" },
      { value: "AU", label: "Australia" },
      { value: "AT", label: "Austria" },
      { value: "AZ", label: "Azerbaijan" },
      { value: "BS", label: "Bahamas" },
      { value: "BH", label: "Bahrain" },
      { value: "BD", label: "Bangladesh" },
      { value: "BB", label: "Barbados" },
      { value: "BY", label: "Belarus" },
      { value: "BE", label: "Belgium" },
      { value: "BZ", label: "Belize" },
      { value: "BJ", label: "Benin" },
      { value: "BM", label: "Bermuda" },
      { value: "BT", label: "Bhutan" },
      { value: "BO", label: "Bolivia" },
      { value: "BA", label: "Bosnia And Herzegowina" },
      { value: "BW", label: "Botswana" },
      { value: "BV", label: "Bouvet Island" },
      { value: "BR", label: "Brazil" },
      { value: "IO", label: "British Indian Ocean Territory" },
      { value: "BN", label: "Brunei Darussalam" },
      { value: "BG", label: "Bulgaria" },
      { value: "BF", label: "Burkina Faso" },
      { value: "BI", label: "Burundi" },
      { value: "KH", label: "Cambodia" },
      { value: "CM", label: "Cameroon" },
      { value: "CV", label: "Cape Verde" },
      { value: "KY", label: "Cayman Islands" },
      { value: "CF", label: "Central African Republic" },
      { value: "TD", label: "Chad" },
      { value: "CL", label: "Chile" },
      { value: "CX", label: "Christmas Island" },
      { value: "CC", label: "Cocos (Keeling) Islands" },
      { value: "CO", label: "Colombia" },
      { value: "KM", label: "Comoros" },
      { value: "CG", label: "Congo" },
      { value: "CK", label: "Cook Islands" },
      { value: "CR", label: "Costa Rica" },
      { value: "CI", label: "Cote D'Ivoire" },
      { value: "HR", label: "Croatia (Local Name: Hrvatska)" },
      { value: "CU", label: "Cuba" },
      { value: "CY", label: "Cyprus" },
      { value: "CZ", label: "Czech Republic" },
      { value: "DK", label: "Denmark" },
      { value: "DJ", label: "Djibouti" },
      { value: "DM", label: "Dominica" },
      { value: "DO", label: "Dominican Republic" },
      { value: "TP", label: "East Timor" },
      { value: "EC", label: "Ecuador" },
      { value: "EG", label: "Egypt" },
      { value: "SV", label: "El Salvador" },
      { value: "GQ", label: "Equatorial Guinea" },
      { value: "ER", label: "Eritrea" },
      { value: "EE", label: "Estonia" },
      { value: "ET", label: "Ethiopia" },
      { value: "FK", label: "Falkland Islands (Malvinas)" },
      { value: "FO", label: "Faroe Islands" },
      { value: "FJ", label: "Fiji" },
      { value: "FI", label: "Finland" },
      { value: "FR", label: "France" },
      { value: "GF", label: "French Guiana" },
      { value: "PF", label: "French Polynesia" },
      { value: "TF", label: "French Southern Territories" },
      { value: "GA", label: "Gabon" },
      { value: "GM", label: "Gambia" },
      { value: "GE", label: "Georgia" },
      { value: "DE", label: "Germany" },
      { value: "GH", label: "Ghana" },
      { value: "GI", label: "Gibraltar" },
      { value: "GR", label: "Greece" },
      { value: "GL", label: "Greenland" },
      { value: "GD", label: "Grenada" },
      { value: "GP", label: "Guadeloupe" },
      { value: "GU", label: "Guam" },
      { value: "GT", label: "Guatemala" },
      { value: "GN", label: "Guinea" },
      { value: "GW", label: "Guinea-Bissau" },
      { value: "GY", label: "Guyana" },
      { value: "HT", label: "Haiti" },
      { value: "HM", label: "Heard And Mc Donald Islands" },
      { value: "VA", label: "Holy See (Vatican City State)" },
      { value: "HN", label: "Honduras" },
      { value: "HK", label: "Hong Kong" },
      { value: "HU", label: "Hungary" },
      { value: "IS", label: "Icel And" },
      { value: "ID", label: "Indonesia" },
      { value: "IR", label: "Iran (Islamic Republic Of)" },
      { value: "IQ", label: "Iraq" },
      { value: "IE", label: "Ireland" },
      { value: "IL", label: "Israel" },
      { value: "IT", label: "Italy" },
      { value: "JM", label: "Jamaica" },
      { value: "JP", label: "Japan" },
      { value: "JO", label: "Jordan" },
      { value: "KZ", label: "Kazakhstan" },
      { value: "KE", label: "Kenya" },
      { value: "KI", label: "Kiribati" },
      { value: "KP", label: "Korea, Dem People'S Republic" },
      { value: "KR", label: "Korea, Republic Of" },
      { value: "KW", label: "Kuwait" },
      { value: "KG", label: "Kyrgyzstan" },
      { value: "LA", label: "Lao People'S Dem Republic" },
      { value: "LV", label: "Latvia" },
      { value: "LB", label: "Lebanon" },
      { value: "LS", label: "Lesotho" },
      { value: "LR", label: "Liberia" },
      { value: "LY", label: "Libyan Arab Jamahiriya" },
      { value: "LI", label: "Liechtenstein" },
      { value: "LT", label: "Lithuania" },
      { value: "LU", label: "Luxembourg" },
      { value: "MO", label: "Macau" },
      { value: "MK", label: "Macedonia" },
      { value: "MG", label: "Madagascar" },
      { value: "MW", label: "Malawi" },
      { value: "MV", label: "Maldives" },
      { value: "ML", label: "Mali" },
      { value: "MT", label: "Malta" },
      { value: "MH", label: "Marshall Islands" },
      { value: "MQ", label: "Martinique" },
      { value: "MR", label: "Mauritania" },
      { value: "MU", label: "Mauritius" },
      { value: "YT", label: "Mayotte" },
      { value: "FM", label: "Micronesia, Federated States" },
      { value: "MD", label: "Moldova, Republic Of" },
      { value: "MC", label: "Monaco" },
      { value: "MN", label: "Mongolia" },
      { value: "MS", label: "Montserrat" },
      { value: "MA", label: "Morocco" },
      { value: "MZ", label: "Mozambique" },
      { value: "MM", label: "Myanmar" },
      { value: "NA", label: "Namibia" },
      { value: "NR", label: "Nauru" },
      { value: "NP", label: "Nepal" },
      { value: "NL", label: "Netherlands" },
      { value: "AN", label: "Netherlands Ant Illes" },
      { value: "NC", label: "New Caledonia" },
      { value: "NZ", label: "New Zealand" },
      { value: "NI", label: "Nicaragua" },
      { value: "NE", label: "Niger" },
      { value: "NG", label: "Nigeria" },
      { value: "NU", label: "Niue" },
      { value: "NF", label: "Norfolk Island" },
      { value: "MP", label: "Northern Mariana Islands" },
      { value: "NO", label: "Norway" },
      { value: "OM", label: "Oman" },
      { value: "PK", label: "Pakistan" },
      { value: "PW", label: "Palau" },
      { value: "PA", label: "Panama" },
      { value: "PG", label: "Papua New Guinea" },
      { value: "PY", label: "Paraguay" },
      { value: "PE", label: "Peru" },
      { value: "PH", label: "Philippines" },
      { value: "PN", label: "Pitcairn" },
      { value: "PL", label: "Poland" },
      { value: "PT", label: "Portugal" },
      { value: "PR", label: "Puerto Rico" },
      { value: "QA", label: "Qatar" },
      { value: "RE", label: "Reunion" },
      { value: "RO", label: "Romania" },
      { value: "RU", label: "Russian Federation" },
      { value: "RW", label: "Rwanda" },
      { value: "KN", label: "Saint K Itts And Nevis" },
      { value: "LC", label: "Saint Lucia" },
      { value: "VC", label: "Saint Vincent, The Grenadines" },
      { value: "WS", label: "Samoa" },
      { value: "SM", label: "San Marino" },
      { value: "ST", label: "Sao Tome And Principe" },
      { value: "SA", label: "Saudi Arabia" },
      { value: "SN", label: "Senegal" },
      { value: "SC", label: "Seychelles" },
      { value: "SL", label: "Sierra Leone" },
      { value: "SK", label: "Slovakia (Slovak Republic)" },
      { value: "SI", label: "Slovenia" },
      { value: "SB", label: "Solomon Islands" },
      { value: "SO", label: "Somalia" },
      { value: "ZA", label: "South Africa" },
      { value: "GS", label: "South Georgia , S Sandwich Is." },
      { value: "ES", label: "Spain" },
      { value: "LK", label: "Sri Lanka" },
      { value: "SH", label: "St. Helena" },
      { value: "PM", label: "St. Pierre And Miquelon" },
      { value: "SD", label: "Sudan" },
      { value: "SR", label: "Suriname" },
      { value: "SJ", label: "Svalbard, Jan Mayen Islands" },
      { value: "SZ", label: "Sw Aziland" },
      { value: "SE", label: "Sweden" },
      { value: "CH", label: "Switzerland" },
      { value: "SY", label: "Syrian Arab Republic" },
      { value: "TW", label: "Taiwan" },
      { value: "TJ", label: "Tajikistan" },
      { value: "TZ", label: "Tanzania, United Republic Of" },
      { value: "TH", label: "Thailand" },
      { value: "TG", label: "Togo" },
      { value: "TK", label: "Tokelau" },
      { value: "TO", label: "Tonga" },
      { value: "TT", label: "Trinidad And Tobago" },
      { value: "TN", label: "Tunisia" },
      { value: "TR", label: "Turkey" },
      { value: "TM", label: "Turkmenistan" },
      { value: "TC", label: "Turks And Caicos Islands" },
      { value: "TV", label: "Tuvalu" },
      { value: "UG", label: "Uganda" },
      { value: "UA", label: "Ukraine" },
      { value: "AE", label: "United Arab Emirates" },
      { value: "UM", label: "United States Minor Is." },
      { value: "UY", label: "Uruguay" },
      { value: "UZ", label: "Uzbekistan" },
      { value: "VU", label: "Vanuatu" },
      { value: "VE", label: "Venezuela" },
      { value: "VN", label: "Viet Nam" },
      { value: "VG", label: "Virgin Islands (British)" },
      { value: "VI", label: "Virgin Islands (U.S.)" },
      { value: "WF", label: "Wallis And Futuna Islands" },
      { value: "EH", label: "Western Sahara" },
      { value: "YE", label: "Yemen" },
      { value: "ZR", label: "Zaire" },
      { value: "ZM", label: "Zambia" },
      { value: "ZW", label: "Zimbabwe" },
    ];
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return new Error(data.message || "Invalid request data");
        case 401:
          return new Error(data.message || "Unauthorized access");
        case 403:
          return new Error(data.message || "Access denied");
        case 404:
          return new Error(data.message || "Resource not found");
        case 422:
          return new Error(data.message || "Validation failed");
        case 500:
          return new Error(data.message || "Internal server error");
        default:
          return new Error(data.message || "An error occurred");
      }
    } else if (error.request) {
      // Network error
      return new Error("Network error. Please check your connection.");
    } else {
      // Other error
      return new Error(error.message || "An unexpected error occurred");
    }
  }
}

export default new VolunteerService();
