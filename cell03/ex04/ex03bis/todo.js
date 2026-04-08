$(document).ready(function() {
    // โหลดข้อมูลเมื่อหน้าเว็บพร้อม
    loadTodos();

    // เมื่อคลิกปุ่ม New
    $('#new_btn').on('click', function() {
        const task = prompt("Please enter your new TO DO:");
        if (task !== null && task.trim() !== "") {
            addTodo(task);
            saveTodos();
        }
    });

    // ฟังก์ชันสร้างและเพิ่ม To-Do ลงในลิสต์
    function addTodo(text) {
        // สร้าง div ใหม่ด้วย jQuery
        const $div = $('<div></div>').text(text);

        // ดักจับการคลิกเพื่อลบ (ใช้ jQuery .on('click'))
        $div.on('click', function() {
            if (confirm("Do you really want to delete this TO DO?")) {
                $(this).remove(); // ใช้ $(this) แทน div.remove()
                saveTodos();
            }
        });

        // เพิ่มไว้บนสุดของลิสต์ (เหมือนเดิม)
        $('#ft_list').prepend($div);
    }

    // ฟังก์ชันบันทึกข้อมูลลง Cookie
    function saveTodos() {
        const todos = [];
        // วนลูปดึงข้อความจากทุก div ในลิสต์
        $('#ft_list div').each(function() {
            todos.unshift($(this).text());
        });

        const d = new Date();
        d.setTime(d.getTime() + (7*24*60*60*1000));
        let expires = "expires=" + d.toUTCString();
        
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
                // นำข้อมูลกลับมาแสดงผล
                $.each(todos, function(index, task) {
                    addTodo(task);
                });
                return;
            }
        }
    }
});