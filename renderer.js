// Fetch the desktop path when the app starts
window.api.getDesktopPath().then((desktopPath) => {
    console.log('Desktop Path:', desktopPath);
    // You can use the desktopPath variable as needed
}).catch((error) => {
    console.error('Failed to get desktop path:', error);
});

// Store the selected folder path globally
let outputFolderPath = '';

// Store the available commands and options for auto-suggestion
const commands = {
    'search': {
        description: 'Search artifacts in the catalog',
        options: {
            '--query': { short: '-q', description: 'Search query' },
            '--queryCategory': { 
                short: '--qc', 
                description: 'Search category', 
                choices: ['keyword', 'publication', 'collection', 'provenience', 'period', 'transliteration', 'translation', 'id'] 
            },
            '--queryOperator': { 
                short: '--qo', 
                description: 'Search operator', 
                choices: ['AND', 'OR'] 
            },
            '--advancedField': { short: '--af', description: 'Advanced search field' },
            '--advancedQuery': { short: '--aq', description: 'Advanced search query' },
            '--filterField': { short: '--fk', description: 'Filter by field' },
            '--filterValue': { short: '--fv', description: 'Filter by value' },
            '--version': { description: 'Show version number' },
            '--host': { short: '-h', description: 'Host URL to use for API calls' },
            '--format': { 
                short: '-f', 
                description: 'File format', 
                choices: ['ndjson', 'csv', 'tsv', 'ntriples', 'bibtex', 'atf'] 
            },
            '--output-file': { short: '-o', description: 'Output file' },
            '--help': { description: 'Show help' },
        },
    },
};

// Period Choices Array (strings)
const periodChoices = ["\"Pre-Writing (ca. 8500-3500 BC)\"", "\"Uruk V (ca. 3500-3350 BC)\"", "\"Uruk IV (ca. 3350-3200 BC)\"", "\"Egyptian 0 (ca. 3300-3000 BC)\"", "\"Uruk III (ca. 3200-3000 BC)\"", "\"Proto-Elamite (ca. 3100-2900 BC)\"", "\"ED I-II (ca. 2900-2700 BC)\"", "\"ED IIIa (ca. 2600-2500 BC)\"", "\"ED IIIb (ca. 2500-2340 BC)\"", "\"Ebla (ca. 2350-2250 BC)\"", "\"Old Akkadian (ca. 2340-2200 BC)\"", "\"Old Elamite (c. 2600-1500 BC)\"", "\"Linear Elamite (ca. 2200 BC)\"", "\"Lagash II (ca. 2200-2100 BC)\"", "\"Harappan (ca. 2200-1900 BC)\"", "\"Ur III (ca. 2100-2000 BC)\"", "\"Early Old Babylonian (ca. 2000-1900 BC)\"", "\"Old Assyrian (ca. 1950-1850 BC)\"", "\"Old Babylonian (ca. 1900-1600 BC)\"", "\"Middle Hittite (ca. 1500-1100 BC)\"", "\"Middle Babylonian (ca. 1400-1100 BC)\"", "\"Middle Assyrian (ca. 1400-1000 BC)\"", "\"Middle Elamite (ca. 1500-1100 BC)\"", "\"Early Neo-Babylonian (ca. 1150-730 BC)\"", "\"Neo-Assyrian (ca. 911-612 BC)\"", "\"Neo-Elamite (ca. 770-539 BC)\"", "\"Neo-Babylonian (ca. 626-539 BC)\"", "\"Achaemenid (547-331 BC)\"", "\"Hellenistic (323-63 BC)\"", "\"Parthian (247 BC - 224 AD)\"", "\"Sassanian (224-641 AD)\"", "\"modern\"", "\"no value\""];

// Material Choices Array (strings)
const materialChoices = ["\"blue\"", "\"bitumen\"", "\"bone\"", "\"bone > ivory\"", "\"bone > shell\"", "\"clay\"", "\"clay > ceramic\"", "\"clay > porcelain\"", "\"faience\"", "\"frit\"", "\"glass\"", "\"metal\"", "\"metal > bronze\"", "\"metal > copper\"", "\"metal > electrum\"", "\"metal > gold\"", "\"metal > iron\"", "\"metal > iron oxide\"", "\"metal > lead\"", "\"metal > silver\"", "\"stone\"", "\"stone > aphrite\"", "\"stone > igneous rock > basalt\"", "\"stone > igneous rock > diorite\"", "\"stone > igneous rock > felsite\"", "\"stone > igneous rock > granite\"", "\"stone > igneous rock > greenstone\"", "\"stone > igneous rock > lava\"", "\"stone > igneous rock > obsidian\"", "\"stone > igneous rock > porphyry\"", "\"stone > igneous rock > syenite\"", "\"stone > igneous rock > trachyte\"", "\"stone > igneous rock > tuff\"", "\"stone > limonite\"", "\"stone > metamorphic rock > gneiss\"", "\"stone > metamorphic rock > hornfels\"", "\"stone > metamorphic rock > jade\"", "\"stone > metamorphic rock > lapis lazuli\"", "\"stone > metamorphic rock > marble\"", "\"stone > metamorphic rock > quartzite\"", "\"stone > metamorphic rock > schist\"", 
    "\"stone > metamorphic rock > steatite\"", "\"stone > mineral > agate\"", "\"stone > mineral > alabaster\"", "\"stone > mineral > amethyst\"", "\"stone > mineral > aragonite\"", "\"stone > mineral > azurite\"", "\"stone > mineral > bloodstone\"", "\"stone > mineral > calcite\"", "\"stone > mineral > carnelian\"", "\"stone > mineral > chalcedony\"", "\"stone > mineral > chalcocite\"", "\"stone > mineral > chlorite\"", "\"stone > mineral > cornelian\"", "\"stone > mineral > dolomite\"", "\"stone > mineral > feldspar\"", "\"stone > mineral > feldspar > amazonite\"", "\"stone > mineral > garnet\"", "\"stone > mineral > goethite\"", "\"stone > mineral > gypsum\"", "\"stone > mineral > hematite\"", "\"stone > mineral > hornblende\"", "\"stone > mineral > jadeite\"", "\"stone > mineral > jasper\"", "\"stone > mineral > magnesite\"", "\"stone > mineral > magnetite\"", "\"stone > mineral > malachite\"", "\"stone > mineral > menaccanite\"", "\"stone > mineral > mica\"", "\"stone > mineral > nephrite\"", "\"stone > mineral > onyx\"", "\"stone > mineral > quartz\"", "\"stone > mineral > rock crystal\"", "\"stone > mineral > sardonyx\"", "\"stone > mineral > serpentine\"", "\"stone > mineral > serpentine > ophicalcite\"", "\"stone > mineral > siderite\"", "\"stone > mineral > talc\"", "\"stone > mineral > turquoise\"", "\"stone > polypary fossil\"", "\"stone > quartz-dolerite\"", "\"stone > sedimentary rock > basanite\"", "\"stone > sedimentary rock > breccia\"", "\"stone > sedimentary rock > chert\"", "\"stone > sedimentary rock > flint\"", "\"stone > sedimentary rock > limestone\"", "\"stone > sedimentary rock > sandstone\"", "\"stone > sedimentary rock > shale\"", "\"stone > sedimentary rock > slate\"", "\"stone > sedimentary rock > travertine\"", "\"wood\"", "\"no value\""];

// Proveniences Choices Array (strings)
const provenienceChoices = ["\"Abdju (mod. Abydos)\"", "\"Adab (mod. Bismaya)\"", "\"Adabilu (mod. uncertain)\"", "\"Admannu (mod. Tall ‘Ali)\"", "\"Agamatanu (mod. uncertain)\"", "\"Akhetaten (mod. el-Amarna)\"", "\"Alalakh (mod. Tell Açana/Atshana)\"", "\"Alu-binatu (mod. uncertain)\"", "\"Alu-eššu (mod. uncertain)\"", "\"Alu-ša-BAD-MAH-AN (mod. uncertain)\"", "\"Alu-ša-šuma-ukin (mod. uncertain)\"", "\"Alu-šabtu (mod. uncertain)\"", "\"Amurru-šar-uṣur (mod. uncertain)\"", "\"Antipatris (mod. Tel Aphek)\"", "\"Anšan (mod. Tell Malyan)\"", "\"Aqa (mod. uncertain)\"", "\"Arrapha (mod. Kirkuk)\"", "\"Asdūdu (mod. Ashdod)\"", "\"Assur (mod. Qalat Sherqat)\"", "\"Ašnakkum (mod. Chagar Bazar)\"", "\"Ba-milkišu (mod. uncertain)\"", "\"Babylon (mod. Bābil)\"", "\"Bad-Tibira (mod. Tell Medinah)\"", "\"Baḫe (mod. uncertain)\"", "\"Bit-ali-... (mod. uncertain)\"", "\"Bit-zerija (mod. uncertain)\"", "\"Bit-Šaḫṭu (mod. uncertain)\"", "\"Bit-šar-Babili (mod. uncertain)\"", "\"Bit-ḫulummu (mod. uncertain)\"", "\"Bit-ṭab-bel (mod. uncertain)\"", "\"Borsippa (mod. Birs Nimrud)\"", "\"Burmarina (mod. Tell Shiukh Fawqani)\"", "\"Bāb-ṣubbāti (mod. uncertain)\"", "\"Bīt-Abī-rām (mod. uncertain)\"", "\"Bīt-Bāba-ēriš (mod. uncertain)\"", "\"Bīt-Dibušiti (mod. uncertain)\"", "\"Bīt-Našar (mod. uncertain)\"", "\"Bīt-Naʾinnašu (mod. uncertain)\"", "\"Bīt-ham... (mod. uncertain)\"", "\"Bīt-Šinqā (mod. uncertain)\"", 
    "\"Curium (mod. Kourion Cyprus)\"", "\"Der (mod. Tell Aqar)\"", "\"Dilbat (mod. Deilam)\"", "\"Dilmun (mod. Qal'at al-Bahrain)\"", "\"Du-Enlila (mod. uncertain)\"", "\"Dur-Katlimmu (mod. Tall Shekh Hamad)\"", "\"Dur-Kurigalzu (mod. Aqar Quf)\"", "\"Dur-Untaš (mod. Chogha Zanbil)\"", "\"Dur-Šarrukin (mod. Khorsabad)\"", "\"Dusabar (mod. uncertain)\"", "\"Dūr-Abī-ēšuḫ (mod. uncertain)\"", "\"Ebla (mod. Tell Mardikh)\"", "\"Ecbatana (mod. uncertain)\"", "\"Ekalte (mod. Tell Munbaqa)\"", "\"Elammu (mod. uncertain)\"", "\"Emar (mod. Tell Meskene)\"", "\"Epurasie (mod. uncertain)\"", "\"Eridu (mod. Abu Shahrain)\"", "\"Ešnunna (mod. Tell Asmar)\"", "\"Ešura (mod. uncertain)\"", "\"GARIN-naḫallum (mod. uncertain)\"", "\"Garšana (mod. uncertain)\"", "\"Gasur/Nuzi (mod. Yorgan Tepe)\"", "\"Girigu (mod. uncertain)\"", "\"Girsu (mod. Tello)\"", "\"Gišša (mod. Umm al-Aqarib)\"", "\"Gišši (mod. uncertain)\"", "\"Gubla (mod. Byblos)\"", "\"Guzana (mod. Tell Halaf)\"", "\"Halicarnassus (mod. Halicarnassus)\"", "\"Hamat (mod. uncertain)\"", "\"Hamath (mod. Hama)\"", "\"Harradum (mod. Khirbet ed-Diniye)\"", "\"Harran (mod. Harran)\"", "\"Hazatu (mod. uncertain)\"", "\"Himuru (mod. uncertain)\"", "\"Hummanu (mod. uncertain)\"", "\"Hurruba (mod. uncertain)\"", "\"Hursagkalama (mod. Ingharra)\"", "\"Huzirina (mod. Sultantepe)\"", "\"Idu (mod. Hīt)\"", "\"Imgur-Enlil (mod. Balawat)\"", "\"Irisagrig (mod. uncertain)\"", "\"Isin (mod. Bahriyat)\"", "\"Isqalluna (mod. Ashkelon)\"", 
    "\"KI.AN (mod. uncertain)\"", "\"Kabnak (mod. Haft Tappeh)\"", "\"Kahat (mod. Tell Barri)\"", "\"Kalhu (mod. Nimrūd)\"", "\"Kanesh (mod. Kültepe)\"", "\"Kapri-ša-naqidati (mod. uncertain)\"", "\"Kapru (mod. uncertain)\"", "\"Kar-Mullissi (mod. Tall al-Qaddīsah Barbārah)\"", "\"Kar-Nabu (mod. uncertain)\"", "\"Kar-Tukulti-Ninurta (mod. Tulul al-ʿAqir)\"", "\"Kar-bel-matati (mod. uncertain)\"", "\"Karkemish (mod. Djerabis)\"", "\"Kazallu (mod. uncertain)\"", "\"Kašši... (mod. uncertain)\"", "\"Kesh (mod. uncertain)\"", "\"Kian (Tell Shmid)\"", "\"Kilizu (mod. Qasr Shamamuk)\"", "\"Kish (mod. Tell Barguthiat)\"", "\"Kish (mod. Tell Ingharra)\"", "\"Kish (mod. Tell Uhaimir)\"", "\"Kish (mod. Tell el-Bender)\"", "\"Kisurra (mod. Abu Hatab)\"", "\"Kišesim (mod. Najafabad)\"", "\"Kulišhinaš (mod. Amuda)\"", "\"Kumu (mod. uncertain)\"", "\"Kutalla (mod. Tell Sifr)\"", "\"Kutha (mod. Tell Ibrahim)\"", "\"Lachish (mod. Tell ed-Duweir)\"", "\"Lagaba (mod. uncertain)\"", "\"Lagash (mod. El-Hiba)\"", "\"Larsa (mod. Tell as-Senkereh)\"",
    "\"Ma'allanate (mod. uncertain)\"", "\"Malgium (mod. Tulūl Yassir)\"", "\"Marad (mod. Wanna-wa-Sadum)\"", "\"Mardaman (mod. Bassetki)\"", "\"Mari (mod. Tell Hariri)\"", "\"Marqasu (mod. Kahramanmaraş)\"", "\"Maškan-šapir (mod. Tell Abu Duwari)\"", "\"Me-Turran (mod. Tell Haddad)\"", "\"Melidu (mod. Arslantepe)\"", "\"Nagar (mod. Tell Brak)\"", "\"Naḫalla (mod. uncertain)\"", "\"Naṣir (mod. uncertain)\"", "\"Nereb (mod. Neirab)\"", "\"Nerebtum (mod. Iščali)\"", "\"Nigin (mod. Ishān Zurghul)\"", "\"Nineveh (mod. Kuyunjik)\"", "\"Nineveh (mod. Nebi Yunus)\"", "\"Nineveh (mod. Nīnūa)\"", "\"Nippur (mod. Nuffar)\"", "\"Pašime (mod. Tell Abu Sheeja)\"", "\"Per-Bast (mod. Tell Basta)\"", "\"Puzriš-Dagan (mod. Drehem)\"", "\"Pārśa (mod. Persepolis)\"", "\"Pī-Kasî (mod. Tell Abu Antiq)\"", "\"Qasr-i Abu Nasr (mod. uncertain)\"", "\"Qattara (mod. Tell al Rimah)\"", "\"Qatuna (mod. uncertain)\"", "\"Qāṭīnu (mod. uncertain)\"", "\"Rusahinili (mod. Toprakkale)\"", "\"Sagub (mod. uncertain)\"", "\"Samal (mod. Zinčirli)\"", "\"Samerina (mod. Samaria)\"", "\"Seleucia (mod. Tell 'Umar)\"", "\"Shaddikanni (mod. Tell Ajaja)\"", "\"Shaduppum (mod. Tell Harmal)\"", "\"Shuruppak (mod. Fara)\"", "\"Sippar-Amnanum (mod. Tell ed-Der)\"", "\"Sippar-Yahrurum (mod. Tell Abu Habbah)\"", "\"Surkh Dum (mod. Sorḵdom)\"", "\"Surru (mod. uncertain)\"", "\"Susa (mod. Shush)\"", "\"Susarra (mod. Tell Shemshara)\"", 
    "\"Tall-I Takht (mod. Pasargadae)\"", "\"Tarbisu (mod. Tell Sherif Khan)\"", "\"Tema (mod. Tayma)\"", "\"Terqa (mod. Ashara)\"", "\"Thêbai (mod. Thebes Beoticia Greece)\"", "\"Tigunānum (mod. uncertain)\"", "\"Til Barsip (mod. Tell Ahmar)\"", "\"Timnah (mod. Khirbet Tibneh)\"", "\"Tripoli (mod. Al Mina)\"", "\"Tunip (mod. Acharneh)\"", "\"Turbessel (mod. Tell Bāshir)\"", "\"Tushhan (mod. Ziyaret Tepe)\"", "\"Tuttul (mod. Tell Bi'a)\"", "\"Tutub (mod. Khafaje)\"", "\"Udannu (mod. uncertain)\"", "\"Ugarit (mod. Ras Shamra)\"", "\"Umma (mod. Tell Jokha)\"", "\"Uncertain (mod. Tell Kirbāsi)\"", "\"Unqi (mod. Tell Ta'ynat)\"", "\"Upi (mod. Opis)\"", "\"Ur (mod. Tell Muqayyar)\"", "\"Urkesh (mod. Tell Mozan)\"", "\"Uruk (mod. Warka)\"", "\"Yāhūdu (mod. uncertain)\"", "\"Zabalam (mod. Tall Ibzaīykh)\"", 
    "\"uncertain (mod. 'Ana)\"", "\"uncertain (mod. Abu Fandowa)\"", "\"uncertain (mod. Abu Halawa)\"", "\"uncertain (mod. Abu Jawan)\"", "\"uncertain (mod. Abu Salabikh)\"", "\"uncertain (mod. Abu Sêcher)\"", "\"uncertain (mod. Abu-Maria)\"", "\"uncertain (mod. Alisar)\"", "\"uncertain (mod. Amran)\"", "\"uncertain (mod. Aqabi)\"", "\"uncertain (mod. Aşağı Yarımca)\"", "\"uncertain (mod. Babil, Turkey)\"", "\"uncertain (mod. Bardi Sanjian Bitwata)\"", "\"uncertain (mod. Bavian)\"", "\"uncertain (mod. Behistun)\"", "\"uncertain (mod. Beisan)\"", "\"uncertain (mod. Ben Shemen)\"", "\"uncertain (mod. Beydar)\"", "\"uncertain (mod. Brissa)\"", "\"uncertain (mod. Cave Kalm-karra)\"", "\"uncertain (mod. Chamchamal)\"", "\"uncertain (mod. Chenar-e Pain)\"", "\"uncertain (mod. Chia Puikeh)\"", "\"uncertain (mod. Chogha Mish)\"", "\"uncertain (mod. Dawali)\"", "\"uncertain (mod. Deh-e No)\"", "\"uncertain (mod. Dharan)\"", "\"uncertain (mod. Diqdiqqah)\"", "\"uncertain (mod. Dohuk)\"", "\"uncertain (mod. Dura-Europus)\"", "\"uncertain (mod. El-Khargeh)\"", "\"uncertain (mod. Failaka)\"", "\"uncertain (mod. Faqous)\"", "\"uncertain (mod. Gezer)\"", "\"uncertain (mod. Ghazir)\"", "\"uncertain (mod. Gherla Romania)\"", "\"uncertain (mod. Giricano)\"", "\"uncertain (mod. Glai'a)\"", "\"uncertain (mod. Godin Tepe)\"", "\"uncertain (mod. Habuba Kabira)\"", "\"uncertain (mod. Hadidi)\"", "\"uncertain (mod. Hamadan)\"", "\"uncertain (mod. Hazor)\"", "\"uncertain (mod. Hillah)\"", "\"uncertain (mod. Himeri)\"", "\"uncertain (mod. Himrin/Tell Suleimah)\"", "\"uncertain (mod. Hissar)\"", "\"uncertain (mod. Hour Soleiman)\"", "\"uncertain (mod. Ibzaih)\"", "\"uncertain (mod. Ishan-Dhahak)\"", "\"uncertain (mod. Išān Hāfudh)\"", 
    "\"uncertain (mod. Jebel Aruda)\"", "\"uncertain (mod. Jedide)\"", "\"uncertain (mod. Jemdet Nasr)\"", "\"uncertain (mod. Jericho)\"", "\"uncertain (mod. Jerwan)\"", "\"uncertain (mod. Judi Dagh)\"", "\"uncertain (mod. Kabret)\"", "\"uncertain (mod. Kam-Firouz)\"", "\"uncertain (mod. Kani Joni I)\"", "\"uncertain (mod. Kani Joni II)\"", "\"uncertain (mod. Kastri Cythera Greece)\"", "\"uncertain (mod. Kermanshah)\"", "\"uncertain (mod. Khan Haswa)\"", "\"uncertain (mod. Kibbutz Hama-apil)\"", "\"uncertain (mod. Kizkapanlı)\"", "\"uncertain (mod. Konar Sandal)\"", "\"uncertain (mod. Kurkh)\"", "\"uncertain (mod. Kuşaklı)\"", "\"uncertain (mod. Lacarna)\"", "\"uncertain (mod. Lahir)\"", "\"uncertain (mod. Lidar Höyük)\"", "\"uncertain (mod. Mah-i-dasht plain)\"", "\"uncertain (mod. Mahmudiyah)\"", "\"uncertain (mod. Masat Höyük)\"", "\"uncertain (mod. Mazyad)\"", "\"uncertain (mod. Megiddo)\"", "\"uncertain (mod. Merj Khamis)\"", "\"uncertain (mod. Mila Mergi)\"", "\"uncertain (mod. Mount Elvend)\"", "\"uncertain (mod. Mugdan/Umm al-Jir)\"", "\"uncertain (mod. Māhān)\"", "\"uncertain (mod. Nahavand)\"", "\"uncertain (mod. Nahr el-Kelb)\"", "\"uncertain (mod. Naqš-i-Rustam)\"", "\"uncertain (mod. Nar-Madanu)\"", "\"uncertain (mod. Negub tunnel)\"", "\"uncertain (mod. Nessana)\"", "\"uncertain (mod. Old Makhmur)\"", "\"uncertain (mod. Ozbaki)\"", "\"uncertain (mod. Padakka/Ha'it, Saudi Arabia)\"", "\"uncertain (mod. Palmyra)\"", "\"uncertain (mod. Pir Huseyin)\"", "\"uncertain (mod. Pāra)\"", "\"uncertain (mod. Qaṭibat)\"", "\"uncertain (mod. Rabat Tepe)\"", "\"uncertain (mod. Ras Ibn Hani)\"", "\"uncertain (mod. Saba'a)\"", "\"uncertain (mod. Samarra)\"", "\"uncertain (mod. Sar-i-pul-i-Zohāb)\"", "\"uncertain (mod. Sela)\"", 
    "\"uncertain (mod. Sepphoris)\"", "\"uncertain (mod. Shadad)\"", "\"uncertain (mod. Shahr-i Sokhta)\"", "\"uncertain (mod. Shiqāft-i Gulgul)\"", "\"uncertain (mod. Shir as-Sanam)\"", "\"uncertain (mod. Sidon)\"", "\"uncertain (mod. Suez)\"", "\"uncertain (mod. Sur Jar'a)\"", "\"uncertain (mod. Tall Imlīḥiyah)\"", "\"uncertain (mod. Tall al-Farḥa)\"", "\"uncertain (mod. Tall al-Qiṭar)\"", "\"uncertain (mod. Tall-I Nokhodi)\"", "\"uncertain (mod. Tang-i Var)\"", "\"uncertain (mod. Tappeh Bormi)\"", "\"uncertain (mod. Tas-Silg, Malta)\"", "\"uncertain (mod. Tell Abta)\"", "\"uncertain (mod. Tell Abu Galgal)\"", "\"uncertain (mod. Tell Abu Hajar)\"", "\"uncertain (mod. Tell Abu Harmal)\"", "\"uncertain (mod. Tell Abu Nakhlab)\"", "\"uncertain (mod. Tell Abu Qubur)\"", "\"uncertain (mod. Tell Agrab)\"", "\"uncertain (mod. Tell Baradan)\"", "\"uncertain (mod. Tell Basmaya)\"", "\"uncertain (mod. Tell Fakhariyah)\"", "\"uncertain (mod. Tell Fray)\"", "\"uncertain (mod. Tell Ghdairife)\"", "\"uncertain (mod. Tell Hammam et-Turkman)\"", "\"uncertain (mod. Tell Hammam)\"", 
    "\"uncertain (mod. Tell Huweish)\"", "\"uncertain (mod. Tell Jidr)\"", "\"uncertain (mod. Tell Kar)\"", "\"uncertain (mod. Tell Khaiber)\"", "\"uncertain (mod. Tell Muhammad)\"", "\"uncertain (mod. Tell Sabaa)\"", "\"uncertain (mod. Tell Sabi Abyad)\"", "\"uncertain (mod. Tell Subeidi)\"", "\"uncertain (mod. Tell Sukas)\"", "\"uncertain (mod. Tell Sweyhat)\"", "\"uncertain (mod. Tell Taanach)\"", "\"uncertain (mod. Tell Ubaid)\"", "\"uncertain (mod. Tell Uqair)\"", "\"uncertain (mod. Tell Yarah)\"", "\"uncertain (mod. Tell Yelkhi)\"", "\"uncertain (mod. Tell al-Diba'i)\"", "\"uncertain (mod. Tell al-Hawa)\"", "\"uncertain (mod. Tell al-Lahm)\"", "\"uncertain (mod. Tell el-Hesi)\"", "\"uncertain (mod. Tell el-Maskuta)\"", "\"uncertain (mod. Tell en-Nasbeh)\"", "\"uncertain (mod. Tell es-Seeb)\"", "\"uncertain (mod. Tepe Farukhabad)\"", "\"uncertain (mod. Tepe Gawra)\"", "\"uncertain (mod. Tepe Gotvand)\"", "\"uncertain (mod. Tepe Sialk)\"", "\"uncertain (mod. Tepe Sofalin)\"", "\"uncertain (mod. Tepe Yahya)\"", "\"uncertain (mod. Thebes)\"", "\"uncertain (mod. Tikrit)\"", "\"uncertain (mod. Til-Buri)\"", "\"uncertain (mod. Tilmen Höyük)\"", "\"uncertain (mod. Tulul Khatab)\"", "\"uncertain (mod. Tulul al-Lak)\"", "\"uncertain (mod. Turlu Höyük)\"", "\"uncertain (mod. Tuz Hurmati)\"", "\"uncertain (mod. Uluburun)\"", "\"uncertain (mod. Umm Chatil)\"", "\"uncertain (mod. Umm al-Aqarib)\"", "\"uncertain (mod. Umm al-Wawīya)\"", "\"uncertain (mod. Umm el-Djerab)\"", "\"uncertain (mod. Umm el-Hafriyat)\"", "\"uncertain (mod. Yanik Tepe)\"", "\"uncertain (mod. Yasuj)\"", "\"uncertain (mod. Yoncali)\"", "\"uncertain (mod. Za'aleh)\"", "\"uncertain (mod. Zalil Ab)\"", "\"uncertain (mod. Zawiyya)\"", "\"uncertain (mod. el-Ghab)\"", "\"uncertain (mod. uncertain)\"", "\"uncertain (mod. Çorum, Turkey)\"", "\"uncertain (mod. Šišin)\"", "\"unknown\"", "\"Āl-šarri (mod. uncertain)\"", "\"Āl-šarri-ša-qašti-eššeti (mod. uncertain)\"", "\"Ālu-ša-Našar (mod. uncertain)\"", "\"Ālu-ša-Ṭūb-Yāma (mod. uncertain)\"", "\"Šahdad (mod. Kerman)\"", "\"Šapinuwa (mod. Ortaköy)\"", "\"Šašrum (mod. uncertain)\"", "\"Šaḫrinu (mod. uncertain)\"", "\"Šibaniba (mod. Tell Billa)\"", "\"Šubat-Enlil (mod. Leilan)\"", "\"Šūru (mod. uncertain)\"", "\"Ḫadatu (mod. Arslan Tash)\"", "\"Ḫadiranu-ša-Nabu (mod. uncertain)\"", "\"Ḫarbe (mod. Tell Chuera)\"", "\"Ḫattusa (mod. Boğazkale)\"", "\"Ṣurmeš (mod. uncertain)\"", "\"Ṭābetu (mod. Tell Taban)\"", "\"no value\""];

// Genre Choices Array (strings)
const genreChoices = ["\"Administrative\"", "\"Administrative > Account\"", "\"Administrative > Label or tag\"", "\"Administrative > List or inventory\"", "\"Administrative > Receipt\"", "\"Administrative > Seals and sealings\"", "\"Legal\"", "\"Legal > Business / Contracts\"", "\"Legal > Business / Contracts > Lease Contracts\"", "\"Legal > Business / Contracts > Loan Contracts\"", "\"Legal > Business / Contracts > Purchase and sale contracts\"", "\"Legal > Family > Adoption Documents\"", "\"Legal > Family > Divorce Documents\"", "\"Legal > Family > Dowries and other gifts\"", "\"Legal > Family > Inheritance Documents\"", "\"Legal > Family > Marriage Documents\"", "\"Legal > Judicial\"", "\"Legal > Judicial > Oaths\"", "\"Legal > Judicial > Sworn Testimonies\"", "\"Legal > Judicial > Verdicts\"", "\"Letter\"", "\"Lexical\"", "\"Lexical > Acrographic Word List\"", "\"Lexical > Sign exercise\"", "\"Lexical > Sign list\"", "\"Lexical > Thematic word list\"", "\"Lexical > Vocabularies\"", "\"Literary\"", "\"Literary > Composition with historical background\"", "\"Literary > Literary letter and letter-prayer\"", "\"Literary > Ritual and liturgical\"", "\"Literary > Ritual and liturgical > Canonical lamentation\"", "\"Literary > Ritual and liturgical > Incantation\"", "\"Literary > Ritual and liturgical > Prayer\"", "\"Literary > Ritual and liturgical > Ritual\"", "\"Literary > Wisdom or proverb\"", "\"Official or display\"", "\"Official or display > Annals and Chronicle\"", "\"Official or display > Law Collection\"", "\"Official or display > Royal Inscription\"", "\"Official or display > Treaty\"", "\"Official or display > Votive\"", "\"Other\"", "\"Scholarly or scientific\"", "\"Scholarly or scientific > Astral sciences\"", "\"Scholarly or scientific > Astral sciences > Astrology\"", "\"Scholarly or scientific > Astral sciences > Omens\"", "\"Scholarly or scientific > Commentary\"", "\"Scholarly or scientific > Divination\"", "\"Scholarly or scientific > Mathematical\"", "\"Scholarly or scientific > Medical\"", "\"Scholarly or scientific > Plan or Drawing\"", "\"Scholarly or scientific > Recipe or Instruction\"", "\"no value\""];

// Language Choices Array (strings)
const languageChoices = ["\"Akkadian\"", "\"Akkadian > Middle Assyrian\"", "\"Akkadian > Middle Babylonian\"", "\"Akkadian > Old Assyrian\"", "\"Akkadian > Old Babylonian\"", "\"Akkadian > Standard Babylonian\"", "\"Arabic\"", "\"Aramaic\"", "\"Eblaite\"", "\"Egyptian\"", "\"Elamite\"", "\"Greek\"", "\"Hattic\"", "\"Hebrew\"", "\"Hittite\"", "\"Hurrian\"", "\"Luwian\"", "\"Mandaic\"", "\"Persian\"", "\"Phoenician\"", "\"Pseudo language\"", "\"Qatabanian\"", "\"Sabaean\"", "\"Sumerian\"", "\"Sumerian > Emesal\"", "\"Sumerian > Syllabic\"", "\"Syriac\"", "\"Ugaritic\"", "\"Urartian\"", "\"no linguistic content\"", "\"uncertain\"", "\"undetermined\"", "\"no value\""];

// Capture user input and filter suggestions
document.getElementById('commandInput').addEventListener('input', (event) => {
    const input = event.target.value.trim(); // Get the current input value
    const inputParts = input.split(/\s+/); // Split the input by whitespace
    const command = inputParts[0]; // Get the command (first part)
    const lastArgument = inputParts.slice(-1)[0]; // Get the last argument
    const secondLastArgument = inputParts.slice(-2)[0]; // Get the second to last argument
    const thirdLastArgument = inputParts.slice(-3)[0]; // Get the third to last argument
    const suggestionsList = document.getElementById('suggestions'); // Get the suggestions element
    suggestionsList.innerHTML = ''; // Clear previous suggestions
    suggestionsList.style.display = 'none'; // Hide suggestions by default

    // Debugging: Add logs for input values
    console.log(`Input: "${input}"`);
    console.log(`Command: "${command}", Last Argument: "${lastArgument}", Second Last Argument: "${secondLastArgument}", Third Last Argument: "${thirdLastArgument}"`);

    // Check if the command exists in our commands object
    if (commands[command]) {
        const currentOptions = commands[command].options; // Get options for the current command
        console.log('Command recognized:', command);

        // Dynamic filtering for flags
        if (lastArgument.startsWith('--')) {
            console.log('Last argument starts with "--"');
            const filteredOptions = Object.keys(currentOptions).filter(option => option.startsWith(lastArgument));

            // Suggest the filtered flags
            filteredOptions.forEach(option => {
                const listItem = document.createElement('li'); 
                listItem.textContent = option; 
                listItem.addEventListener('click', () => {
                    const newInput = `${inputParts.slice(0, -1).join(' ')} ${option}`; 
                    document.getElementById('commandInput').value = newInput; 
                    suggestionsList.style.display = 'none'; 
                });
                suggestionsList.appendChild(listItem); 
            });

            if (filteredOptions.length > 0) {
                suggestionsList.style.display = 'block'; 
                console.log('Flag suggestions shown:', filteredOptions);
            }
        } 

        // Suggest relevant choices for <something> when user types --fk <something> --fv
        else if ((secondLastArgument === '--fv' || secondLastArgument === '--filterValue') && 
                 (thirdLastArgument === 'language' || thirdLastArgument === 'material' || thirdLastArgument === 'provenience' || thirdLastArgument === 'period' || thirdLastArgument === 'genre')) {
            
            console.log('Choices suggestions should be shown for', thirdLastArgument);

            // User input for filtering, removing quotes for comparison
            const userInputForFiltering = lastArgument.replace(/['"]/g, "").toLowerCase(); // Remove quotes

            // Choose the relevant choices based on the third last argument
            let relevantChoices;
            switch (thirdLastArgument) {
                case 'language':
                    relevantChoices = languageChoices;
                    break;
                case 'material':
                    relevantChoices = materialChoices;
                    break;
                case 'provenience':
                    relevantChoices = provenienceChoices;
                    break;
                case 'period':
                    relevantChoices = periodChoices;
                    break;
                case 'genre':
                    relevantChoices = genreChoices;
                    break;
                default:
                    relevantChoices = [];
            }

            const filteredChoices = relevantChoices.filter(choice => {
                const strippedChoice = choice.replace(/['"]/g, "").toLowerCase(); // Remove quotes from choices
                return strippedChoice.includes(userInputForFiltering); // Compare without quotes
            });

            filteredChoices.forEach(choice => {
                const listItem = document.createElement('li'); 
                listItem.textContent = choice; 
                listItem.addEventListener('click', () => {
                    const newInput = `${inputParts.slice(0, -1).join(' ')} ${choice}`; 
                    document.getElementById('commandInput').value = newInput; 
                    suggestionsList.style.display = 'none'; 
                });
                suggestionsList.appendChild(listItem); 
            });

            suggestionsList.style.display = 'block'; 
            console.log('Filtered choices shown:', filteredChoices);
        }
    } else {
        console.log('Unrecognized command:', command);
    }

    // Keydown event listener for navigating suggestions
    let highlightedIndex = -1; // Track the currently highlighted suggestion
    document.addEventListener('keydown', (e) => {
        const suggestionItems = suggestionsList.getElementsByTagName('li');
        if (suggestionItems.length > 0) {
            if (e.key === 'ArrowDown') {
                // Move down the list
                highlightedIndex = (highlightedIndex + 1) % suggestionItems.length; // Loop around
            } else if (e.key === 'ArrowUp') {
                // Move up the list
                highlightedIndex = (highlightedIndex - 1 + suggestionItems.length) % suggestionItems.length; // Loop around
            } else if (e.key === 'Enter') {
                // Select the highlighted suggestion
                if (highlightedIndex >= 0) {
                    const selectedSuggestion = suggestionItems[highlightedIndex].textContent;
                    const newInput = `${inputParts.slice(0, -1).join(' ')} ${selectedSuggestion}`; 
                    document.getElementById('commandInput').value = newInput; 
                    suggestionsList.style.display = 'none'; // Hide suggestions after selection
                }
            }

            // Highlight the current suggestion
            Array.from(suggestionItems).forEach((item, index) => {
                item.style.backgroundColor = index === highlightedIndex ? '#b3d4fc' : ''; // Change background for the highlighted item
            });
        }
    });
});


// Hide suggestions when clicking outside
window.addEventListener('click', (event) => {
    const suggestionsList = document.getElementById('suggestions');
    if (!event.target.closest('#commandInput')) {
        suggestionsList.style.display = 'none'; // Hide suggestions if clicking outside
    }
});

// Handle the Run button click
document.getElementById('runButton').addEventListener('click', async () => {
    const command = document.getElementById('commandInput').value;
    const outputElement = document.getElementById('output');
    
    // Check if outputFolder is set, if not use desktop path
    let outputFolder = outputFolderPath; // This should be defined somewhere in your code
    if (!outputFolder) {
        outputFolder = await window.api.getDesktopPath(); // Fetch the desktop path if no folder is set
    }

    // Execute the command with the selected output folder
    const result = await window.api.executeCommand(command, outputFolder);
    outputElement.textContent = result;
});

// Handle the folder selection button click
document.getElementById('selectFolderButton').addEventListener('click', async () => {
    outputFolderPath = await window.api.selectOutputFolder(); // Call the exposed function to select a folder
    if (outputFolderPath) {
        document.getElementById('commandInput').value += ` --output-folder="${outputFolderPath}"`; // Optionally update the command input
    }
});

// Handle Enter key press
document.getElementById('commandInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission if in a form
        document.getElementById('runButton').click(); // Trigger the click event of the Run button
    }
});

// Clear button functionality
document.getElementById('clearButton').addEventListener('click', () => {
    document.getElementById('commandInput').value = ''; // Clear the input box
    document.getElementById('output').textContent = ''; // Optionally clear output
});

// Help button functionality
document.getElementById('helpButton').addEventListener('click', () => {
    document.getElementById('helpModal').style.display = 'block'; // Display help modal
});

// Close help modal when clicking outside the content
window.addEventListener('click', (event) => {
    const helpModal = document.getElementById('helpModal');
    if (event.target === helpModal) {
        helpModal.style.display = 'none';
    }
});

// Credits button functionality
document.getElementById('creditsButton').addEventListener('click', () => {
    document.getElementById('creditsModal').style.display = 'block'; // Display credits modal
});

// Close credits modal when clicking outside the content
window.addEventListener('click', (event) => {
    const creditsModal = document.getElementById('creditsModal');
    if (event.target === creditsModal) {
        creditsModal.style.display = 'none';
    }
});
