var newMemberAddBtn = document.querySelector('.addMemberBtn'),
darkBg = document.querySelector('.dark_bg'),
popupForm = document.querySelector('.popup'),
crossBtn = document.querySelector('.closeBtn'),
submitBtn = document.querySelector('.submitBtn'),
 modalTitle = document.querySelector('.modalTitle'),
 popupFooter = document.querySelector('.popupFooter'),
 imgInput = document.querySelector('.img'),
 imgHolder = document.querySelector('.imgholder')
 form = document.querySelector('form'),
 formInputFields = document.querySelectorAll('form input'),
  uploadimg = document.querySelector("#uploadimg"),
  fName = document.getElementById("fName"),
  lName = document.getElementById("lName"),
  age = document.getElementById("age"),
  city = document.getElementById("city"),
  position = document.getElementById("position"),
  salary = document.getElementById("salary"),
  sDate = document.getElementById("sDate"),
  email = document.getElementById("email"),
  phone = document.getElementById("phone"),
  entries = document.querySelector(".showEntries"),
  tabSize = document.getElementById("table_size"),
  userInfo = document.querySelector(".userInfo"),
  table = document.querySelector("table"),
  filterData = document.getElementById("search")

let originalData = localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')) : []
let getData = [...originalData]


let isEdit = false, editId

var arrayLength = 0
var tableSize = 10
var startIndex = 1
var endIndex = 0
var currentIndex = 1
var maxIndex = 0
// Hàm fetch dữ liệu từ MockAPI
async function fetchUsers() {
    try {
        const response = await fetch('https://671772f9b910c6a6e0283c20.mockapi.io/users');
        const users = await response.json();
        console.log("Fetched users:", users); // Kiểm tra dữ liệu lấy về từ API
        if (users.length > 0) {
            originalData = users;
            localStorage.setItem('userProfile', JSON.stringify(originalData));
            getData = [...originalData]; // Cập nhật getData sau khi fetch
            showInfo(); // Hiển thị dữ liệu lên bảng
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}
fetchUsers();
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers(); // Gọi hàm fetchUsers khi trang được tải
});

showInfo()


newMemberAddBtn.addEventListener('click', ()=> {
    isEdit = false
    submitBtn.innerHTML = "Submit"
    modalTitle.innerHTML = "Fill the Form"
    popupFooter.style.display = "block"
    imgInput.src = "./img/pic1.png"
    darkBg.classList.add('active')
    popupForm.classList.add('active')
})

crossBtn.addEventListener('click', ()=>{
    darkBg.classList.remove('active')
    popupForm.classList.remove('active')
    form.reset()
})

uploadimg.onchange = function(){
    if(uploadimg.files[0].size < 1000000){   // 1MB = 1000000
        var fileReader = new FileReader()

        fileReader.onload = function(e){
            var imgUrl = e.target.result
            imgInput.src = imgUrl
        }

        fileReader.readAsDataURL(uploadimg.files[0])
    }

    else{
        alert("This file is too large!")
    }

}

function preLoadCalculations(){
    array = getData
    arrayLength = array.length
    maxIndex = arrayLength / tableSize

    if((arrayLength % tableSize) > 0){
        maxIndex++
    }
}



function displayIndexBtn(){
    preLoadCalculations()

    const pagination = document.querySelector('.pagination')

    pagination.innerHTML = ""

    pagination.innerHTML = '<button onclick="prev()" class="prev">Previous</button>'

    for(let i=1; i<=maxIndex; i++){
        pagination.innerHTML += '<button onclick= "paginationBtn('+i+')" index="'+i+'">'+i+'</button>'
    }

    pagination.innerHTML += '<button onclick="next()" class="next">Next</button>'

    highlightIndexBtn()
}


function highlightIndexBtn(){
    startIndex = ((currentIndex - 1) * tableSize) + 1
    endIndex = (startIndex + tableSize) - 1

    if(endIndex > arrayLength){
        endIndex = arrayLength
    }

    if(maxIndex >= 2){
        var nextBtn = document.querySelector(".next")
        nextBtn.classList.add("act")
    }


    entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`

    var paginationBtns = document.querySelectorAll('.pagination button')
    paginationBtns.forEach(btn => {
        btn.classList.remove('active')
        if(btn.getAttribute('index') === currentIndex.toString()){
            btn.classList.add('active')
        }
    })


    showInfo()
}








// Hàm hiển thị thông tin người dùng
function showInfo() {
    console.log("Data to display:", getData.length); // Kiểm tra dữ liệu trước khi hiển thị
    userInfo.innerHTML = ""; // Đặt lại nội dung trước khi hiển thị dữ liệu mới

    const tab_start = startIndex - 1;
    const tab_end = endIndex;

    if (getData.length > 0) {
        for (let i = tab_start; i < tab_end; i++) {
            let staff = getData[i];
            console.log("Staff Data:", staff); // Kiểm tra từng phần tử staff

            if (staff) {
                let createElement = `<tr class="userInfo">
                    <td>${staff.id}</td>
    <td><img src="${staff.picture || './img/pic1.png'}" alt="" width="40" height="40"></td>
                    <td>${staff.fName +" "+ staff.lName}</td>
                    <td>${staff.age}</td>
                    <td>${staff.city}</td>
                    <td>${staff.position}</td>
                    <td>${staff.salary}</td>
                    <td>${staff.startDate}</td>
                    <td>${staff.email}</td>
                    <td>${staff.phone}</td>
                    <td>
<button onclick="readInfo('${staff.picture}', '${staff.fName}', '${staff.lName}', '${staff.age}', '${staff.city}', '${staff.position}', '${staff.salary}', '${staff.startDate}', '${staff.email}', '${staff.phone}')"><i class="fa-regular fa-eye"></i></button>
                        <button onclick="editInfo('${staff.id}', '${staff.picture}', '${staff.fName}', '${staff.lName}', '${staff.age}', '${staff.city}', '${staff.position}', '${staff.salary}', '${staff.startDate}', '${staff.email}', '${staff.phone}')"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button onclick="deleteInfo(${i})"><i class="fa-regular fa-trash-can"></i></button>
                    </td>
                </tr>`;

                userInfo.innerHTML += createElement;
            }
        }
    } else {
        userInfo.innerHTML = `<tr class="employeeDetails"><td class="empty" colspan="11" align="center">No data available in table</td></tr>`;
    }
}


// Gọi hàm fetchUsers để bắt đầu lấy dữ liệu khi trang được tải


showInfo()


function readInfo(pic, fname, lname, ageVal, cityVal, positionVal, salaryVal, sDateVal, emailVal, phoneVal) {
    imgInput.src = pic || './img/pic1.png';  // Cung cấp ảnh mặc định nếu pic không có
    fName.value = fname || '';
    lName.value = lname || '';
    age.value = ageVal || '';
    city.value = cityVal || '';
    position.value = positionVal || '';
    salary.value = salaryVal || '';
    sDate.value = sDateVal || '';
    email.value = emailVal || '';
    phone.value = phoneVal || '';

    darkBg.classList.add('active');
    popupForm.classList.add('active');
    popupFooter.style.display = "none";
    modalTitle.innerHTML = "Profile";

    // Vô hiệu hóa tất cả các trường nhập
    formInputFields.forEach(input => {
        input.disabled = true;
    });

    imgHolder.style.pointerEvents = "none"; // Ngăn không cho click vào imgHolder
}


function editInfo(id, pic, fname, lname, ageVal, cityVal, positionVal, salaryVal, sDateVal, emailVal, phoneVal) {
    isEdit = true; // Đánh dấu rằng chúng ta đang ở chế độ chỉnh sửa
    editId = id;   // Lưu ID của người dùng đang chỉnh sửa

    // Cập nhật nội dung của form với thông tin của người dùng
    imgInput.src = pic || './img/pic1.png'; // Cung cấp ảnh mặc định nếu pic không có
    fName.value = fname || '';
    lName.value = lname || '';
    age.value = ageVal || '';
    city.value = cityVal || '';
    position.value = positionVal || '';
    salary.value = salaryVal || '';
    sDate.value = sDateVal || '';
    email.value = emailVal || '';
    phone.value = phoneVal || '';

    // Hiển thị form pop-up
    darkBg.classList.add('active');
    popupForm.classList.add('active');
    popupFooter.style.display = "block"; // Hiển thị nút Submit
    modalTitle.innerHTML = "Update the Form"; // Cập nhật tiêu đề
    submitBtn.innerHTML = "Update"; // Cập nhật nút thành "Update"

    // Kích hoạt các trường nhập liệu để người dùng có thể chỉnh sửa
    formInputFields.forEach(input => {
        input.disabled = false; // Bỏ vô hiệu hóa các trường nhập liệu
    });

    imgHolder.style.pointerEvents = "auto"; // Cho phép click vào imgHolder
}


async function deleteInfo(index) {
    console.log("Delete button clicked");
    console.log("Original Data Length:", originalData.length); 
    if (index < 0 || index >= originalData.length) {
        console.error('Invalid index for deletion');
        return;
    }

    if (confirm("Are you sure you want to delete?")) {
        const userId = originalData[index].id;

        try {
            await fetch(`https://671772f9b910c6a6e0283c20.mockapi.io/users/${userId}`, {
                method: 'DELETE'
            });

            originalData.splice(index, 1);
            localStorage.setItem("userProfile", JSON.stringify(originalData));

            getData = [...originalData];
            preLoadCalculations();

          

            showInfo();
            highlightIndexBtn();
            displayIndexBtn();

        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
}


form.addEventListener('submit', async (e)=> {
    e.preventDefault()

    const information = {
        picture: imgInput.src === undefined ? "./img/pic1.png" : imgInput.src,
        fName: fName.value,
        lName: lName.value,
        age: age.value,
        city: city.value,
        position: position.value,
        salary: salary.value,
        startDate: sDate.value,
        email: email.value,
        phone: phone.value
    }

    if (!isEdit) {
        try {
            const response = await fetch('https://671772f9b910c6a6e0283c20.mockapi.io/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(information)
            });

            const newUser = await response.json();
            originalData.unshift(newUser);
            localStorage.setItem('userProfile', JSON.stringify(originalData));

            alert('User created successfully');
        } catch (error) {
            console.error('Error creating user:', error);
        }
    } else {
        try {
            const response = await fetch(`https://671772f9b910c6a6e0283c20.mockapi.io/users/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(information)
            });
    
            const updatedUser = await response.json();
            originalData = originalData.map(user => user.id === updatedUser.id ? updatedUser : user);
            localStorage.setItem('userProfile', JSON.stringify(originalData));
    
            alert('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    
    
    
    getData = [...originalData];
    submitBtn.innerHTML = "Submit";
    modalTitle.innerHTML = "Fill the Form";
    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
    form.reset();

    highlightIndexBtn();
    displayIndexBtn();
    showInfo();
});


function next(){
    var prevBtn = document.querySelector('.prev')
    var nextBtn = document.querySelector('.next')

    if(currentIndex <= maxIndex - 1){
        currentIndex++
        prevBtn.classList.add("act")

        highlightIndexBtn()
    }

    if(currentIndex > maxIndex - 1){
        nextBtn.classList.remove("act")
    }
}


function prev(){
    var prevBtn = document.querySelector('.prev')

    if(currentIndex > 1){
        currentIndex--
        prevBtn.classList.add("act")
        highlightIndexBtn()
    }

    if(currentIndex < 2){
        prevBtn.classList.remove("act")
    }
}


function paginationBtn(i){
    currentIndex = i

    var prevBtn = document.querySelector('.prev')
    var nextBtn = document.querySelector('.next')

    highlightIndexBtn()

    if(currentIndex > maxIndex - 1){
        nextBtn.classList.remove('act')
    }
    else{
        nextBtn.classList.add("act")
    }


    if(currentIndex > 1){
        prevBtn.classList.add("act")
    }

    if(currentIndex < 2){
        prevBtn.classList.remove("act")
    }
}



tabSize.addEventListener('change', ()=>{
    var selectedValue = parseInt(tabSize.value)
    tableSize = selectedValue
    currentIndex = 1
    startIndex = 1
    displayIndexBtn()
})



filterData.addEventListener("input", () => {
    const searchTerm = filterData.value.toLowerCase().trim();

    if (searchTerm !== "") {
        const filteredData = originalData.filter((item) => {
            const fullName = (item.fName + " " + item.lName).toLowerCase();
            const city = item.city.toLowerCase(); // Sửa lại thành item.city
            const position = item.position.toLowerCase(); // Sửa lại thành item.position

            return (
                fullName.includes(searchTerm) ||
                city.includes(searchTerm) ||
                position.includes(searchTerm)
            );
        });

        // Cập nhật dữ liệu hiển thị với dữ liệu đã lọc
        getData = filteredData;
    } else {
        // Nếu không có gì trong ô tìm kiếm, trả lại dữ liệu gốc
        getData = JSON.parse(localStorage.getItem('userProfile')) || [];
    }

    currentIndex = 1;
    startIndex = 1;
    displayIndexBtn();
});



displayIndexBtn()