'use strict';

class DatePicker {
    constructor(id, callback) {
        this.id = id;
        this.container = document.getElementById(id);
        this.callback = callback;
        this.date = new Date();
    }

    render(date) {
        if (date instanceof Date) {
            this.date = date;
        }
        const calendarHTML = this.generateCalendarHTML();
        this.container.innerHTML = calendarHTML;
        this.setupControls();
    }



    generateCalendarHTML() {
        const firstDayOfMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
        const lastDayOfMonth=new Date(this.date.getFullYear(),this.date.getMonth()+1, 0).getDate();
        let previousMonth=new Date(this.date.getFullYear(),
            this.date.getMonth(), -firstDayOfMonth + 1).getDate();
        const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        let calendarHTML = `
        
            <table>
                <thead>
                    <tr class="top-header">
                        <th colspan="5">${this.getMonthName()} ${this.date.getFullYear()}</th>
                    </tr>
                    <tr>
                        ${dayNames.map(day => `<th>${day}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        let dayCounter = 1;
        let nextMonthCounter = 1;
        for (let i = 0; i < 6; i++) {
            calendarHTML += '<tr>';

            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDayOfMonth) {
                    calendarHTML += `<td class="other-month">${previousMonth}</td>`;
                    previousMonth++;
                } else if (dayCounter <= lastDayOfMonth) {
                    calendarHTML += `<td>${dayCounter}</td>`;
                    dayCounter++;
                } else {
                    calendarHTML += `<td class="other-month">${nextMonthCounter}</td>`;
                    nextMonthCounter++;
                }
            }
            calendarHTML += '</tr>';
            if (dayCounter > lastDayOfMonth) {
                break;
            }
        }
        calendarHTML += `
                </tbody>
            </table>
        `;
        return calendarHTML;
    }

    getMonthName() {
        const monthNum = this.date.getMonth();
        const monthArray = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ];
        return monthArray[monthNum];
    }

    setupControls() {
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '&lt;'; // Use HTML entities for '<'
        prevButton.addEventListener('click', () => {
            this.date.setMonth(this.date.getMonth() - 1);
            this.render();
        });

        const nextButton = document.createElement('button');
        nextButton.innerHTML = '&gt;'; // Use HTML entities for '>'
        nextButton.addEventListener('click', () => {
            this.date.setMonth(this.date.getMonth() + 1);
            this.render();
        });

        const topHeader = this.container.getElementsByClassName("top-header").item(0);
        topHeader.prepend(prevButton);
        topHeader.append(nextButton);
        
        const tableDatas = Array.from(this.container.getElementsByTagName("td"));
        tableDatas.forEach(element => {
            if (element.getAttribute('class') !== 'other-month') {
                element.addEventListener('click', () => {
                    this.callback(this.id, {
                        month: this.date.getMonth()+1,
                        day: element.textContent,
                        year: this.date.getFullYear()
                    });
                });
            }
        });
    }


}