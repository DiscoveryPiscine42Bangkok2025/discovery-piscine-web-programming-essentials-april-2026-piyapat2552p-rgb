const ftList = document.getElementById('ft_list');
const btnNew = document.getElementById('new_btn');

// โหลดข้อมูลจาก Cookie เมื่อเปิดหน้าเว็บ
window.onload = function() {
    loadTodos();
};

// เมื่อคลิกปุ่ม New
btnNew.addEventListener('click', () => {
    const task = prompt("Please enter your new TO DO:");
    
    // ตรวจสอบว่าไม่เป็นค่าว่าง (และไม่กด Cancel)
    if (task !== null && task.trim() !== "") {
        addTodo(task);
        saveTodos();
    }
});

// ฟังก์ชันสร้าง Element และเพิ่มลงในลิสต์ (ไว้ด้านบนสุด)
function addTodo(text) {
    const div = document.createElement('div');
    div.textContent = text;

    // เมื่อคลิกที่รายการเพื่อลบ
    div.addEventListener('click', () => {
        if (confirm("Do you really want to delete this TO DO?")) {
            div.remove();
            saveTodos(); // อัปเดต Cookie หลังจากลบ
        }
    });

    // โจทย์สั่งให้ "placed at the top of the list"
    ftList.prepend(div);
}

// ฟังก์ชันบันทึกข้อมูลลง Cookie
function saveTodos() {
    const todos = [];
    const items = ftList.querySelectorAll('div');
    
    // เก็บข้อความจาก div ทุกตัว (วนลูปจากหลังมาหน้าเพื่อให้ตอนโหลดกลับมาลำดับเหมือนเดิม)
    items.forEach(item => {
        todos.unshift(item.textContent);
    });

    // บันทึกเป็น JSON string ใน Cookie (ตั้งชื่อว่า 'todo_list')
    // กำหนดให้มีอายุ 7 วัน
    const d = new Date();
    d.setTime(d.getTime() + (7*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    
    // ใช้ encodeURIComponent เพื่อป้องกันปัญหาเรื่องอักขระพิเศษ
    document.cookie = "todo_list=" + encodeURIComponent(JSON.stringify(todos)) + ";" + expires + ";path=/";
}

// ฟังก์ชันโหลดข้อมูลจาก Cookie
function loadTodos() {
    const name = "todo_list=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            const jsonStr = c.substring(name.length, c.length);
            const todos = JSON.parse(jsonStr);
            // เพิ่มกลับเข้าไปใน List
            todos.forEach(task => addTodo(task));
            return;
        }
    }
}