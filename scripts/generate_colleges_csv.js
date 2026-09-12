const fs = require('fs');
const path = require('path');

const colleges = [
  // ── BANGALORE (Karnataka) ──
  { name: "Indian Institute of Science (IISc)", city: "Bangalore", state: "Karnataka", type: "Institute of National Importance", latitude: 13.0219, longitude: 77.5671 },
  { name: "Indian Institute of Management Bangalore (IIMB)", city: "Bangalore", state: "Karnataka", type: "Institute of National Importance", latitude: 12.8956, longitude: 77.6015 },
  { name: "International Institute of Information Technology Bangalore (IIITB)", city: "Bangalore", state: "Karnataka", type: "Deemed University", latitude: 12.8440, longitude: 77.6633 },
  { name: "National Law School of India University (NLSIU)", city: "Bangalore", state: "Karnataka", type: "State University", latitude: 12.9515, longitude: 77.5146 },
  { name: "National Institute of Mental Health and Neuro Sciences (NIMHANS)", city: "Bangalore", state: "Karnataka", type: "Institute of National Importance", latitude: 12.9392, longitude: 77.5959 },
  { name: "Christ University (Main Campus, Hosur Road)", city: "Bangalore", state: "Karnataka", type: "Deemed University", latitude: 12.9345, longitude: 77.6060 },
  { name: "Christ University (Bannerghatta Road Campus)", city: "Bangalore", state: "Karnataka", type: "Deemed University", latitude: 12.8631, longitude: 77.6001 },
  { name: "Christ University (Yeshwanthpur Campus)", city: "Bangalore", state: "Karnataka", type: "Deemed University", latitude: 13.0336, longitude: 77.5342 },
  { name: "RV College of Engineering (RVCE)", city: "Bangalore", state: "Karnataka", type: "Autonomous College", latitude: 12.9237, longitude: 77.4987 },
  { name: "BMS College of Engineering (BMSCE)", city: "Bangalore", state: "Karnataka", type: "Autonomous College", latitude: 12.9410, longitude: 77.5655 },
  { name: "MS Ramaiah Institute of Technology (MSRIT)", city: "Bangalore", state: "Karnataka", type: "Autonomous College", latitude: 13.0315, longitude: 77.5650 },
  { name: "MS Ramaiah University of Applied Sciences (MSRUAS)", city: "Bangalore", state: "Karnataka", type: "Private University", latitude: 13.0298, longitude: 77.5645 },
  { name: "PES University (Ring Road Campus)", city: "Bangalore", state: "Karnataka", type: "Private University", latitude: 12.9344, longitude: 77.5345 },
  { name: "PES University (Electronic City Campus)", city: "Bangalore", state: "Karnataka", type: "Private University", latitude: 12.8617, longitude: 77.6644 },
  { name: "Dayananda Sagar College of Engineering (DSCE)", city: "Bangalore", state: "Karnataka", type: "Autonomous College", latitude: 12.9081, longitude: 77.5659 },
  { name: "Dayananda Sagar University (DSU)", city: "Bangalore", state: "Karnataka", type: "Private University", latitude: 12.8252, longitude: 77.5601 },
  { name: "Bangalore University (Jnana Bharathi Campus)", city: "Bangalore", state: "Karnataka", type: "State University", latitude: 12.9482, longitude: 77.5028 },
  { name: "St. Joseph's University (Langford Road)", city: "Bangalore", state: "Karnataka", type: "State University", latitude: 12.9620, longitude: 77.6015 },
  { name: "Mount Carmel College (Autonomous)", city: "Bangalore", state: "Karnataka", type: "Autonomous College", latitude: 12.9926, longitude: 77.5925 },
  { name: "St. John's Medical College", city: "Bangalore", state: "Karnataka", type: "Private College", latitude: 12.9315, longitude: 77.6186 },
  { name: "Bangalore Medical College and Research Institute (BMCRI)", city: "Bangalore", state: "Karnataka", type: "Government Medical College", latitude: 12.9610, longitude: 77.5746 },
  { name: "New Horizon College of Engineering (NHCE)", city: "Bangalore", state: "Karnataka", type: "Autonomous College", latitude: 12.9342, longitude: 77.6917 },
  { name: "BMS Institute of Technology and Management (BMSIT)", city: "Bangalore", state: "Karnataka", type: "Autonomous College", latitude: 13.1332, longitude: 77.5678 },
  { name: "Nitte Meenakshi Institute of Technology (NMIT)", city: "Bangalore", state: "Karnataka", type: "Autonomous College", latitude: 13.1287, longitude: 77.5873 },
  { name: "Acharya Institute of Technology", city: "Bangalore", state: "Karnataka", type: "Private College", latitude: 13.0845, longitude: 77.4842 },
  { name: "Reva University", city: "Bangalore", state: "Karnataka", type: "Private University", latitude: 13.1154, longitude: 77.6358 },
  { name: "CMR University", city: "Bangalore", state: "Karnataka", type: "Private University", latitude: 13.0906, longitude: 77.6534 },
  { name: "Alliance University", city: "Bangalore", state: "Karnataka", type: "Private University", latitude: 12.7289, longitude: 77.7088 },
  { name: "Jain University", city: "Bangalore", state: "Karnataka", type: "Deemed University", latitude: 12.9568, longitude: 77.5794 },
  { name: "Presidency University Bangalore", city: "Bangalore", state: "Karnataka", type: "Private University", latitude: 13.1678, longitude: 77.5342 },
  { name: "The Oxford College of Engineering", city: "Bangalore", state: "Karnataka", type: "Private College", latitude: 12.9022, longitude: 77.6200 },
  { name: "Sir M. Visvesvaraya Institute of Technology (Sir MVIT)", city: "Bangalore", state: "Karnataka", type: "Private College", latitude: 13.1511, longitude: 77.6083 },

  // ── PUNE (Maharashtra) ──
  { name: "Savitribai Phule Pune University (SPPU)", city: "Pune", state: "Maharashtra", type: "State University", latitude: 18.5529, longitude: 73.8266 },
  { name: "College of Engineering Pune (COEP Technological University)", city: "Pune", state: "Maharashtra", type: "State University", latitude: 18.5293, longitude: 73.8565 },
  { name: "Symbiosis International University (Lavale Campus)", city: "Pune", state: "Maharashtra", type: "Deemed University", latitude: 18.5362, longitude: 73.7314 },
  { name: "Symbiosis Institute of Business Management (SIBM)", city: "Pune", state: "Maharashtra", type: "Deemed University", latitude: 18.5365, longitude: 73.7310 },
  { name: "Symbiosis Law School (Viman Nagar)", city: "Pune", state: "Maharashtra", type: "Deemed University", latitude: 18.5665, longitude: 73.9123 },
  { name: "Fergusson College (Autonomous)", city: "Pune", state: "Maharashtra", type: "Autonomous College", latitude: 18.5236, longitude: 73.8398 },
  { name: "Armed Forces Medical College (AFMC)", city: "Pune", state: "Maharashtra", type: "Institute of National Importance", latitude: 18.5020, longitude: 73.8920 },
  { name: "B.J. Government Medical College", city: "Pune", state: "Maharashtra", type: "Government Medical College", latitude: 18.5262, longitude: 73.8736 },
  { name: "Vishwakarma Institute of Technology (VIT Pune)", city: "Pune", state: "Maharashtra", type: "Autonomous College", latitude: 18.4636, longitude: 73.8682 },
  { name: "Vishwakarma Institute of Information Technology (VIIT)", city: "Pune", state: "Maharashtra", type: "Autonomous College", latitude: 18.4590, longitude: 73.8837 },
  { name: "Pune Institute of Computer Technology (PICT)", city: "Pune", state: "Maharashtra", type: "Autonomous College", latitude: 18.4575, longitude: 73.8508 },
  { name: "MIT World Peace University (MIT-WPU, Kothrud)", city: "Pune", state: "Maharashtra", type: "Private University", latitude: 18.5178, longitude: 73.8151 },
  { name: "Bharati Vidyapeeth Deemed University (Dhankawadi)", city: "Pune", state: "Maharashtra", type: "Deemed University", latitude: 18.4578, longitude: 73.8540 },
  { name: "Sinhgad College of Engineering (Vadgaon)", city: "Pune", state: "Maharashtra", type: "Private College", latitude: 18.4642, longitude: 73.8361 },
  { name: "Sinhgad Institute of Technology and Science (Narhe)", city: "Pune", state: "Maharashtra", type: "Private College", latitude: 18.4485, longitude: 73.8242 },
  { name: "MKSSS's Cummins College of Engineering for Women", city: "Pune", state: "Maharashtra", type: "Autonomous College", latitude: 18.4883, longitude: 73.8173 },
  { name: "Army Institute of Technology (AIT)", city: "Pune", state: "Maharashtra", type: "Private College", latitude: 18.6068, longitude: 73.8749 },
  { name: "D.Y. Patil International University (Akurdi)", city: "Pune", state: "Maharashtra", type: "Private University", latitude: 18.6475, longitude: 73.7592 },
  { name: "Dr. D.Y. Patil Vidyapeeth (Pimpri)", city: "Pune", state: "Maharashtra", type: "Deemed University", latitude: 18.6253, longitude: 73.8140 },
  { name: "Brihan Maharashtra College of Commerce (BMCC)", city: "Pune", state: "Maharashtra", type: "Autonomous College", latitude: 18.5255, longitude: 73.8345 },
  { name: "Sir Parashurambhau College (SP College)", city: "Pune", state: "Maharashtra", type: "Autonomous College", latitude: 18.5050, longitude: 73.8512 },
  { name: "Modern College of Arts, Science and Commerce (Shivajinagar)", city: "Pune", state: "Maharashtra", type: "Autonomous College", latitude: 18.5305, longitude: 73.8478 },
  { name: "Indian Institute of Science Education and Research Pune (IISER Pune)", city: "Pune", state: "Maharashtra", type: "Institute of National Importance", latitude: 18.5444, longitude: 73.8078 },
  { name: "Film and Television Institute of India (FTII)", city: "Pune", state: "Maharashtra", type: "Autonomous Institute", latitude: 18.5140, longitude: 73.8315 },
  { name: "National Defence Academy (NDA Khadakwasla)", city: "Pune", state: "Maharashtra", type: "Defence Academy", latitude: 18.4544, longitude: 73.7667 },
  { name: "FLAME University", city: "Pune", state: "Maharashtra", type: "Private University", latitude: 18.5303, longitude: 73.7058 },
  { name: "Indira Institute of Management (Tathawade)", city: "Pune", state: "Maharashtra", type: "Private College", latitude: 18.6128, longitude: 73.7505 },
  { name: "Pimpri Chinchwad College of Engineering (PCCOE)", city: "Pune", state: "Maharashtra", type: "Autonomous College", latitude: 18.6517, longitude: 73.7615 },

  // ── DELHI (Delhi NCR) ──
  { name: "Indian Institute of Technology Delhi (IIT Delhi)", city: "Delhi", state: "Delhi", type: "Institute of National Importance", latitude: 28.5450, longitude: 77.1926 },
  { name: "Delhi University (North Campus - Main)", city: "Delhi", state: "Delhi", type: "Central University", latitude: 28.6906, longitude: 77.2066 },
  { name: "St. Stephen's College (DU)", city: "Delhi", state: "Delhi", type: "Constituent College", latitude: 28.6853, longitude: 77.2098 },
  { name: "Hindu College (DU)", city: "Delhi", state: "Delhi", type: "Constituent College", latitude: 28.6840, longitude: 77.2085 },
  { name: "Miranda House (DU)", city: "Delhi", state: "Delhi", type: "Constituent College", latitude: 28.6912, longitude: 77.2104 },
  { name: "Shri Ram College of Commerce (SRCC, DU)", city: "Delhi", state: "Delhi", type: "Constituent College", latitude: 28.6865, longitude: 77.2075 },
  { name: "Hansraj College (DU)", city: "Delhi", state: "Delhi", type: "Constituent College", latitude: 28.6800, longitude: 77.2092 },
  { name: "Kirori Mal College (KMC, DU)", city: "Delhi", state: "Delhi", type: "Constituent College", latitude: 28.6845, longitude: 77.2090 },
  { name: "Ramjas College (DU)", city: "Delhi", state: "Delhi", type: "Constituent College", latitude: 28.6848, longitude: 77.2079 },
  { name: "Lady Shri Ram College for Women (LSR, DU)", city: "Delhi", state: "Delhi", type: "Constituent College", latitude: 28.5678, longitude: 77.2435 },
  { name: "Sri Venkateswara College (Venky, DU South Campus)", city: "Delhi", state: "Delhi", type: "Constituent College", latitude: 28.5878, longitude: 77.1672 },
  { name: "Delhi University (South Campus)", city: "Delhi", state: "Delhi", type: "Central University", latitude: 28.5862, longitude: 77.1645 },
  { name: "Jawaharlal Nehru University (JNU)", city: "Delhi", state: "Delhi", type: "Central University", latitude: 28.5400, longitude: 77.1666 },
  { name: "Jamia Millia Islamia (JMI)", city: "Delhi", state: "Delhi", type: "Central University", latitude: 28.5616, longitude: 77.2802 },
  { name: "Delhi Technological University (DTU, Rohini)", city: "Delhi", state: "Delhi", type: "State University", latitude: 28.7501, longitude: 77.1177 },
  { name: "Netaji Subhas University of Technology (NSUT, Dwarka)", city: "Delhi", state: "Delhi", type: "State University", latitude: 28.6100, longitude: 77.0375 },
  { name: "Indira Gandhi Delhi Technical University for Women (IGDTUW)", city: "Delhi", state: "Delhi", type: "State University", latitude: 28.6652, longitude: 77.2325 },
  { name: "Guru Gobind Singh Indraprastha University (GGSIPU, Dwarka)", city: "Delhi", state: "Delhi", type: "State University", latitude: 28.5950, longitude: 77.0195 },
  { name: "Maharaja Agrasen Institute of Technology (MAIT, Rohini)", city: "Delhi", state: "Delhi", type: "Affiliated College", latitude: 28.7231, longitude: 77.0673 },
  { name: "Bharati Vidyapeeth's College of Engineering (Paschim Vihar)", city: "Delhi", state: "Delhi", type: "Affiliated College", latitude: 28.6756, longitude: 77.1132 },
  { name: "All India Institute of Medical Sciences (AIIMS New Delhi)", city: "Delhi", state: "Delhi", type: "Institute of National Importance", latitude: 28.5672, longitude: 77.2100 },
  { name: "Maulana Azad Medical College (MAMC)", city: "Delhi", state: "Delhi", type: "Government Medical College", latitude: 28.6366, longitude: 77.2410 },
  { name: "Lady Hardinge Medical College (LHMC)", city: "Delhi", state: "Delhi", type: "Government Medical College", latitude: 28.6338, longitude: 77.2144 },
  { name: "Vardhman Mahavir Medical College (VMMC & Safdarjung Hospital)", city: "Delhi", state: "Delhi", type: "Government Medical College", latitude: 28.5714, longitude: 77.2075 },
  { name: "National Law University Delhi (NLU Delhi, Dwarka)", city: "Delhi", state: "Delhi", type: "State University", latitude: 28.5912, longitude: 77.0204 },
  { name: "Indian Institute of Foreign Trade (IIFT Delhi)", city: "Delhi", state: "Delhi", type: "Deemed University", latitude: 28.5408, longitude: 77.1989 },
  { name: "Indraprastha Institute of Information Technology Delhi (IIIT-Delhi)", city: "Delhi", state: "Delhi", type: "State University", latitude: 28.5459, longitude: 77.2732 },
  { name: "Atma Ram Sanatan Dharma College (ARSD, DU)", city: "Delhi", state: "Delhi", type: "Constituent College", latitude: 28.5878, longitude: 77.1652 },
  { name: "Gargi College (DU)", city: "Delhi", state: "Delhi", type: "Constituent College", latitude: 28.5528, longitude: 77.2206 },
  { name: "Dyal Singh College (DU, Lodhi Road)", city: "Delhi", state: "Delhi", type: "Constituent College", latitude: 28.5901, longitude: 77.2345 },

  // ── MUMBAI (Maharashtra) ──
  { name: "Indian Institute of Technology Bombay (IIT Bombay, Powai)", city: "Mumbai", state: "Maharashtra", type: "Institute of National Importance", latitude: 19.1334, longitude: 72.9133 },
  { name: "University of Mumbai (Kalina Campus)", city: "Mumbai", state: "Maharashtra", type: "State University", latitude: 19.0735, longitude: 72.8601 },
  { name: "University of Mumbai (Fort Campus)", city: "Mumbai", state: "Maharashtra", type: "State University", latitude: 18.9298, longitude: 72.8315 },
  { name: "St. Xavier's College (Autonomous, Dhobi Talao)", city: "Mumbai", state: "Maharashtra", type: "Autonomous College", latitude: 18.9436, longitude: 72.8318 },
  { name: "Veermata Jijabai Technological Institute (VJTI, Matunga)", city: "Mumbai", state: "Maharashtra", type: "Autonomous College", latitude: 19.0222, longitude: 72.8561 },
  { name: "Institute of Chemical Technology (ICT Mumbai, Matunga)", city: "Mumbai", state: "Maharashtra", type: "Deemed University", latitude: 19.0238, longitude: 72.8586 },
  { name: "Sardar Patel Institute of Technology (SPIT, Andheri West)", city: "Mumbai", state: "Maharashtra", type: "Autonomous College", latitude: 19.1232, longitude: 72.8361 },
  { name: "Sardar Patel College of Engineering (SPCE, Andheri West)", city: "Mumbai", state: "Maharashtra", type: "Autonomous College", latitude: 19.1235, longitude: 72.8365 },
  { name: "Narsee Monjee Institute of Management Studies (NMIMS, Vile Parle)", city: "Mumbai", state: "Maharashtra", type: "Deemed University", latitude: 19.1032, longitude: 72.8373 },
  { name: "Mithibai College of Arts and Chauhan Institute of Science", city: "Mumbai", state: "Maharashtra", type: "Autonomous College", latitude: 19.1026, longitude: 72.8376 },
  { name: "K.J. Somaiya College of Engineering (Vidyavihar)", city: "Mumbai", state: "Maharashtra", type: "Private University", latitude: 19.0728, longitude: 72.8998 },
  { name: "K.J. Somaiya College of Arts and Commerce (Vidyavihar)", city: "Mumbai", state: "Maharashtra", type: "Autonomous College", latitude: 19.0715, longitude: 72.8985 },
  { name: "Tata Institute of Fundamental Research (TIFR, Colaba)", city: "Mumbai", state: "Maharashtra", type: "Deemed University", latitude: 18.9042, longitude: 72.8083 },
  { name: "Tata Institute of Social Sciences (TISS, Deonar)", city: "Mumbai", state: "Maharashtra", type: "Deemed University", latitude: 19.0441, longitude: 72.9142 },
  { name: "Jamnalal Bajaj Institute of Management Studies (JBIMS)", city: "Mumbai", state: "Maharashtra", type: "Autonomous College", latitude: 18.9304, longitude: 72.8277 },
  { name: "Sydenham College of Commerce and Economics (Churchgate)", city: "Mumbai", state: "Maharashtra", type: "Constituent College", latitude: 18.9328, longitude: 72.8272 },
  { name: "H.R. College of Commerce and Economics (Churchgate)", city: "Mumbai", state: "Maharashtra", type: "Constituent College", latitude: 18.9315, longitude: 72.8258 },
  { name: "K.C. College (Churchgate)", city: "Mumbai", state: "Maharashtra", type: "Constituent College", latitude: 18.9320, longitude: 72.8250 },
  { name: "Jai Hind College (Churchgate)", city: "Mumbai", state: "Maharashtra", type: "Autonomous College", latitude: 18.9338, longitude: 72.8245 },
  { name: "Grant Government Medical College & Sir J.J. Group of Hospitals", city: "Mumbai", state: "Maharashtra", type: "Government Medical College", latitude: 18.9628, longitude: 72.8347 },
  { name: "Seth G.S. Medical College & KEM Hospital (Parel)", city: "Mumbai", state: "Maharashtra", type: "Government Medical College", latitude: 19.0028, longitude: 72.8428 },
  { name: "Topiwala National Medical College & BYL Nair Hospital", city: "Mumbai", state: "Maharashtra", type: "Government Medical College", latitude: 18.9734, longitude: 72.8211 },
  { name: "Government Law College (GLC Mumbai, Churchgate)", city: "Mumbai", state: "Maharashtra", type: "Government College", latitude: 18.9326, longitude: 72.8288 },
  { name: "Thadomal Shahani Engineering College (TSEC, Bandra)", city: "Mumbai", state: "Maharashtra", type: "Private College", latitude: 19.0655, longitude: 72.8362 },
  { name: "Fr. Conceicao Rodrigues College of Engineering (Bandra)", city: "Mumbai", state: "Maharashtra", type: "Private College", latitude: 19.0438, longitude: 72.8208 },
  { name: "Don Bosco Institute of Technology (DBIT, Kurla)", city: "Mumbai", state: "Maharashtra", type: "Private College", latitude: 19.0805, longitude: 72.8885 },
  { name: "Vivekanand Education Society's Institute of Technology (VESIT)", city: "Mumbai", state: "Maharashtra", type: "Autonomous College", latitude: 19.0475, longitude: 72.8890 },
  { name: "Dwarkadas J. Sanghvi College of Engineering (DJSCE)", city: "Mumbai", state: "Maharashtra", type: "Autonomous College", latitude: 19.1075, longitude: 72.8370 },
  { name: "Indian Institute of Management Mumbai (formerly NITIE)", city: "Mumbai", state: "Maharashtra", type: "Institute of National Importance", latitude: 19.1408, longitude: 72.9069 },
  { name: "Ramnarain Ruia Autonomous College (Matunga)", city: "Mumbai", state: "Maharashtra", type: "Autonomous College", latitude: 19.0225, longitude: 72.8538 },

  // ── HYDERABAD (Telangana) ──
  { name: "Indian Institute of Technology Hyderabad (IIT Hyderabad)", city: "Hyderabad", state: "Telangana", type: "Institute of National Importance", latitude: 17.5936, longitude: 78.1235 },
  { name: "International Institute of Information Technology Hyderabad (IIIT-H)", city: "Hyderabad", state: "Telangana", type: "Deemed University", latitude: 17.4455, longitude: 78.3489 },
  { name: "University of Hyderabad (UoH, Gachibowli)", city: "Hyderabad", state: "Telangana", type: "Central University", latitude: 17.4567, longitude: 78.3264 },
  { name: "Osmania University (Main Campus, Amberpet)", city: "Hyderabad", state: "Telangana", type: "State University", latitude: 17.4138, longitude: 78.5284 },
  { name: "Jawaharlal Nehru Technological University Hyderabad (JNTUH)", city: "Hyderabad", state: "Telangana", type: "State University", latitude: 17.4938, longitude: 78.3914 },
  { name: "BITS Pilani Hyderabad Campus (Jawahar Nagar)", city: "Hyderabad", state: "Telangana", type: "Deemed University", latitude: 17.5449, longitude: 78.5718 },
  { name: "Indian School of Business (ISB, Gachibowli)", city: "Hyderabad", state: "Telangana", type: "Autonomous Institute", latitude: 17.4395, longitude: 78.3408 },
  { name: "Chaitanya Bharathi Institute of Technology (CBIT, Gandipet)", city: "Hyderabad", state: "Telangana", type: "Autonomous College", latitude: 17.3916, longitude: 78.3198 },
  { name: "Vasavi College of Engineering (Ibrahimbagh)", city: "Hyderabad", state: "Telangana", type: "Autonomous College", latitude: 17.3807, longitude: 78.3826 },
  { name: "VNR Vignana Jyothi Institute of Engineering & Technology (VNR VJIET)", city: "Hyderabad", state: "Telangana", type: "Autonomous College", latitude: 17.5385, longitude: 78.3858 },
  { name: "Gokaraju Rangaraju Institute of Engineering & Technology (GRIET)", city: "Hyderabad", state: "Telangana", type: "Autonomous College", latitude: 17.5205, longitude: 78.3683 },
  { name: "CVR College of Engineering (Ibrahimpatnam)", city: "Hyderabad", state: "Telangana", type: "Autonomous College", latitude: 17.1978, longitude: 78.5975 },
  { name: "Mahindra University (Bahadurpally)", city: "Hyderabad", state: "Telangana", type: "Private University", latitude: 17.5878, longitude: 78.4358 },
  { name: "NALSAR University of Law (Shamirpet)", city: "Hyderabad", state: "Telangana", type: "State University", latitude: 17.6044, longitude: 78.5492 },
  { name: "Nizam's Institute of Medical Sciences (NIMS, Punjagutta)", city: "Hyderabad", state: "Telangana", type: "State University", latitude: 17.4225, longitude: 78.4526 },
  { name: "Gandhi Medical College (Secunderabad)", city: "Hyderabad", state: "Telangana", type: "Government Medical College", latitude: 17.4239, longitude: 78.5028 },
  { name: "Osmania Medical College (Koti)", city: "Hyderabad", state: "Telangana", type: "Government Medical College", latitude: 17.3820, longitude: 78.4842 },
  { name: "Institute of Public Enterprise (IPE, Shamirpet)", city: "Hyderabad", state: "Telangana", type: "Autonomous Institute", latitude: 17.6185, longitude: 78.5742 },
  { name: "Sreenidhi Institute of Science and Technology (SNIST)", city: "Hyderabad", state: "Telangana", type: "Autonomous College", latitude: 17.4542, longitude: 78.6738 },
  { name: "Vardhaman College of Engineering (Shamshabad)", city: "Hyderabad", state: "Telangana", type: "Autonomous College", latitude: 17.2542, longitude: 78.3060 },
  { name: "Malla Reddy College of Engineering & Technology (MRCET)", city: "Hyderabad", state: "Telangana", type: "Autonomous College", latitude: 17.5615, longitude: 78.4552 },
  { name: "CMR College of Engineering & Technology (Kandlakoya)", city: "Hyderabad", state: "Telangana", type: "Autonomous College", latitude: 17.6065, longitude: 78.4885 },
  { name: "Anurag University (Venkatapur)", city: "Hyderabad", state: "Telangana", type: "Private University", latitude: 17.4215, longitude: 78.6565 },
  { name: "Keshav Memorial Institute of Technology (KMIT, Narayanguda)", city: "Hyderabad", state: "Telangana", type: "Autonomous College", latitude: 17.3978, longitude: 78.4912 },
  { name: "Loyola Academy Degree and PG College (Old Alwal)", city: "Hyderabad", state: "Telangana", type: "Autonomous College", latitude: 17.4985, longitude: 78.5098 },
  { name: "St. Francis College for Women (Begumpet)", city: "Hyderabad", state: "Telangana", type: "Autonomous College", latitude: 17.4410, longitude: 78.4618 },
  { name: "Nizam College (Basheerbagh)", city: "Hyderabad", state: "Telangana", type: "Constituent College", latitude: 17.3985, longitude: 78.4735 },
  { name: "Muffakham Jah College of Engineering & Technology (MJCET)", city: "Hyderabad", state: "Telangana", type: "Private College", latitude: 17.4285, longitude: 78.4385 },

  // ── CHENNAI (Tamil Nadu) ──
  { name: "Indian Institute of Technology Madras (IIT Madras, Guindy)", city: "Chennai", state: "Tamil Nadu", type: "Institute of National Importance", latitude: 12.9915, longitude: 80.2337 },
  { name: "College of Engineering Guindy (CEG, Anna University)", city: "Chennai", state: "Tamil Nadu", type: "State University", latitude: 13.0118, longitude: 80.2355 },
  { name: "Madras Institute of Technology (MIT Anna University, Chromepet)", city: "Chennai", state: "Tamil Nadu", type: "Constituent College", latitude: 12.9482, longitude: 80.1398 },
  { name: "University of Madras (Chepauk Campus)", city: "Chennai", state: "Tamil Nadu", type: "State University", latitude: 13.0645, longitude: 80.2828 },
  { name: "Loyola College (Autonomous, Nungambakkam)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous College", latitude: 13.0626, longitude: 80.2350 },
  { name: "Madras Christian College (MCC, Tambaram)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous College", latitude: 12.9248, longitude: 80.1245 },
  { name: "Stella Maris College (Cathedral Road)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous College", latitude: 13.0450, longitude: 80.2520 },
  { name: "Presidency College Chennai (Kamarajar Salai)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous College", latitude: 13.0578, longitude: 80.2820 },
  { name: "Madras Medical College (MMC, Park Town)", city: "Chennai", state: "Tamil Nadu", type: "Government Medical College", latitude: 13.0805, longitude: 80.2785 },
  { name: "Stanley Medical College (George Town)", city: "Chennai", state: "Tamil Nadu", type: "Government Medical College", latitude: 13.1065, longitude: 80.2878 },
  { name: "Sri Ramachandra Institute of Higher Education & Research (Porur)", city: "Chennai", state: "Tamil Nadu", type: "Deemed University", latitude: 13.0375, longitude: 80.1412 },
  { name: "SRM Institute of Science and Technology (Kattankulathur)", city: "Chennai", state: "Tamil Nadu", type: "Deemed University", latitude: 12.8231, longitude: 80.0444 },
  { name: "SRM Institute of Science and Technology (Vadapalani Campus)", city: "Chennai", state: "Tamil Nadu", type: "Deemed University", latitude: 13.0520, longitude: 80.2105 },
  { name: "B.S. Abdur Rahman Crescent Institute of Science & Technology", city: "Chennai", state: "Tamil Nadu", type: "Deemed University", latitude: 12.8795, longitude: 80.0825 },
  { name: "SSN College of Engineering (Kalavakkam, OMR)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous College", latitude: 12.7505, longitude: 80.1975 },
  { name: "Sathyabama Institute of Science and Technology (Jeppiaar Nagar)", city: "Chennai", state: "Tamil Nadu", type: "Deemed University", latitude: 12.8725, longitude: 80.2205 },
  { name: "Hindustan Institute of Technology and Science (HITS, Padur)", city: "Chennai", state: "Tamil Nadu", type: "Deemed University", latitude: 12.8398, longitude: 80.2295 },
  { name: "Sri Venkateswara College of Engineering (SVCE, Sriperumbudur)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous College", latitude: 12.9885, longitude: 79.9725 },
  { name: "Rajalakshmi Engineering College (REC, Thandalam)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous College", latitude: 13.0085, longitude: 80.0035 },
  { name: "St. Joseph's College of Engineering (OMR)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous College", latitude: 12.8685, longitude: 80.2185 },
  { name: "Ethiraj College for Women (Egmore)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous College", latitude: 13.0655, longitude: 80.2575 },
  { name: "Women's Christian College (WCC, Nungambakkam)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous College", latitude: 13.0690, longitude: 80.2465 },
  { name: "Tamil Nadu Dr. Ambedkar Law University (SOEL, Taramani)", city: "Chennai", state: "Tamil Nadu", type: "State University", latitude: 12.9775, longitude: 80.2445 },
  { name: "Asian College of Journalism (ACJ, Taramani)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous Institute", latitude: 12.9882, longitude: 80.2458 },
  { name: "Great Lakes Institute of Management (ECR)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous Institute", latitude: 12.5620, longitude: 80.1685 },
  { name: "Easwari Engineering College (Ramapuram)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous College", latitude: 13.0315, longitude: 80.1805 },
  { name: "Meenakshi College for Women (Kodambakkam)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous College", latitude: 13.0535, longitude: 80.2215 },
  { name: "Guru Nanak College (Velachery)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous College", latitude: 12.9905, longitude: 80.2180 },
  { name: "D.G. Vaishnav College (Arumbakkam)", city: "Chennai", state: "Tamil Nadu", type: "Autonomous College", latitude: 13.0725, longitude: 80.2075 },
  { name: "Saveetha Institute of Medical and Technical Sciences (SIMATS)", city: "Chennai", state: "Tamil Nadu", type: "Deemed University", latitude: 13.0285, longitude: 80.0175 }
];

function escapeCsvField(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const header = "name,city,state,type,latitude,longitude\n";
const rows = colleges.map(c => 
  [c.name, c.city, c.state, c.type, c.latitude, c.longitude].map(escapeCsvField).join(',')
).join('\n');

const csvContent = header + rows + '\n';

// Write to public/colleges.csv (for direct URL download)
const publicPath = path.join(__dirname, '..', 'public', 'colleges.csv');
fs.writeFileSync(publicPath, csvContent, 'utf8');

// Write to root colleges.csv (for direct repo file access)
const rootPath = path.join(__dirname, '..', 'colleges.csv');
fs.writeFileSync(rootPath, csvContent, 'utf8');

console.log(`Generated CSV with ${colleges.length} colleges at:`);
console.log(`- ${publicPath}`);
console.log(`- ${rootPath}`);

module.exports = colleges;
