let dataStore = []; // 存储数据的数组
let lastEntry = null; // 存储上一次写入的数据

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');
    const selectionContainer = document.getElementById('selection-container');
    
    const selectBuilding = document.getElementById('building-select');
    const selectFloor = document.getElementById('floor-select');
    const selectRoom = document.getElementById('room-select');
    const selectProject = document.getElementById('project-select');
    const selectBed = document.getElementById('bed-select');

    // 替换动态生成楼号选项的代码
    const buildings = [
        "男11号楼", "男18号楼", "男10号楼", "男6号楼",
        "女12号楼", "女24级20号楼", "女23级20号楼", "女1号楼"
    ];

    buildings.forEach(building => {
        const option = document.createElement('option');
        option.value = building.includes("女") && building.includes("24级") ? "20" : 
                       building.includes("女") && building.includes("23级") ? "220" : 
                       building.match(/\d+/)[0]; // 直接提取数字
        option.textContent = building;
        selectBuilding.appendChild(option);
    });

    // 处理完成楼号选择
    document.getElementById('complete-button').addEventListener('click', () => {
        if (selectBuilding.value) {
            mainContainer.style.display = 'none';
            selectionContainer.style.display = 'block';
            
            // 动态生成楼层选项
            for (let i = 1; i <= 6; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `${i}层`;
                selectFloor.appendChild(option);
            }
        }
    });

    // 处理楼层选择
    selectFloor.addEventListener('change', () => {
        selectRoom.innerHTML = '<option value="" disabled selected>选择宿舍号</option>'; // 清空宿舍号
        if (selectFloor.value) {
            for (let i = 1; i <= 13; i++) {
                const roomNumber = (parseInt(selectFloor.value) * 100 + i).toString();
                const option = document.createElement('option');
                option.value = roomNumber;
                option.textContent = roomNumber;
                selectRoom.appendChild(option);
            }
        }
    });

    // 处理项目选择
    selectProject.addEventListener('change', () => {
        if (selectProject.value.includes("个人")) {
            document.getElementById('bed-select-container').style.display = 'block';
        } else {
            document.getElementById('bed-select-container').style.display = 'none';
        }
    });

    // 写入数据
    document.getElementById('save-button').addEventListener('click', () => {
        const entry = {
            building: selectBuilding.value,
            floor: selectFloor.value,
            room: selectRoom.value,
            project: selectProject.value,
            reason: document.getElementById('reason-input').value,
            bed: selectProject.value.includes("个人") ? selectBed.value : null
        };
        
        // 保存上一次数据
        lastEntry = entry;
        dataStore.push(entry);
        alert('数据已保存！');
        console.log(dataStore);
        
        // 只重置与楼层、宿舍号、项目、床号和理由相关的选择
        resetSelection();
    });

    // 撤回上一次写入
    document.getElementById('undo-button').addEventListener('click', () => {
        if (lastEntry) {
            const entryDetails = `
                楼号: ${lastEntry.building} 
                楼层: ${lastEntry.floor} 
                宿舍号: ${lastEntry.room} 
                项目: ${lastEntry.project} 
                理由: ${lastEntry.reason} 
                床号: ${lastEntry.bed || '无'}
            `;
            if (confirm(`确认要撤回以下数据吗？\n${entryDetails}`)) {
                const index = dataStore.indexOf(lastEntry);
                if (index !== -1) {
                    dataStore.splice(index, 1); // 从数组中删除
                    alert('已撤回上一次写入的数据。');
                    console.log('撤回数据:', lastEntry);
                    lastEntry = null; // 清空上一次数据
                } else {
                    alert('没有可撤回的数据。');
                }
            }
        } else {
            alert('没有可撤回的数据。');
        }
    });

    // 重置数据
    document.getElementById('reset-button').addEventListener('click', () => {
        if (confirm('确认要重置所有数据吗？')) {
            dataStore = [];
            lastEntry = null;
            alert('数据已重置。');
        }
    });

    // 导出数据
    document.getElementById('export-button').addEventListener('click', () => {
        const formattedData = dataStore.map(entry => {
            const bedPart = entry.bed ? `b${entry.bed}` : ''; // 如果床号存在，添加前缀
            return `b${entry.building}f${entry.floor}r${entry.room}${bedPart}p${entry.project}r${entry.reason}`;
        }).join(''); // 不添加换行符，直接拼接
        navigator.clipboard.writeText(formattedData).then(() => {
            alert('数据已复制到剪贴板！');
        }).catch(err => {
            console.error('复制失败', err);
        });
    });



    // 返回上一页
    document.getElementById('back-button').addEventListener('click', () => {
        if (confirm('确认要返回上一页吗？')) {
            selectionContainer.style.display = 'none';
            mainContainer.style.display = 'block';
            resetSelection();
        }
    });
});
// 处理浏览器窗口关闭或刷新事件
window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = '查完宿舍了吗？如果退出数据都会丢失'; // 提示内容
});

// 重置选择
function resetSelection() {
    const selectFloor = document.getElementById('floor-select');
    const selectRoom = document.getElementById('room-select');
    const selectProject = document.getElementById('project-select');
    const selectBed = document.getElementById('bed-select');

    selectFloor.value = '';
    selectRoom.innerHTML = '<option value="" disabled selected>选择宿舍号</option>'; // 清空宿舍号
    selectProject.value = '';
    selectBed.value = '';
    document.getElementById('reason-input').value = '';
    document.getElementById('bed-select-container').style.display = 'none';
}
