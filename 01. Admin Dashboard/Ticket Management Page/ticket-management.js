/**
 * Ticket Management System
 * Handles ticket creation, status updates, and management functionality
 */

class TicketManager {
    constructor() {
        this.tickets = [];
        this.currentUser = null;
        this.statusOptions = ['Open', 'In Progress', 'Resolved', 'Closed'];
        this.priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
        this.categoryOptions = ['Technical', 'Academic', 'Administrative', 'Other'];
        
        this.init();
    }

    async init() {
        await this.loadCurrentUser();
        await this.loadTickets();
        this.setupEventListeners();
        this.renderTicketList();
        this.updateSummaryCards(this.tickets);
    }

    async loadCurrentUser() {
        try {
            // Get current user information
            this.currentUser = await wixUsers.getCurrentUser();
        } catch (error) {
            console.error('Error loading current user:', error);
        }
    }

    async loadTickets() {
        try {
            const results = await wixData.query('Tickets')
                .descending('_createdDate')
                .find();
            
            this.tickets = results.items;
        } catch (error) {
            console.error('Error loading tickets:', error);
        }
    }

    setupEventListeners() {
        // Modal close button
        $w('#modalClose').onClick(() => this.hideModal());
        
        // Ticket list item clicks - setup repeater
        $w('#ticketList').onItemReady(($item, itemData) => {
            // Populate ticket data in repeater items
            $item('#ticketId').text = itemData._id || itemData.ticketId;
            $item('#ticketTitle').text = itemData.title;
            $item('#ticketDescription').text = itemData.description;
            $item('#ticketSubmitter').text = itemData.submittedBy || itemData.submitterEmail;
            $item('#ticketDate').text = itemData.createdDateFormatted || new Date(itemData._createdDate).toLocaleDateString();
            $item('#ticketStatus').text = itemData.status;
            $item('#ticketPriority').text = itemData.priority;
        });
    }

    hideModal() {
        $w('#modalContainer').hide();
    }

    // Removed createTicket method as it's not needed for this view-only modal

    // Removed viewTicketDetails method as details are shown in repeater

    // Removed update status methods as this is a view-only modal

    // Removed filterTickets method as no filter controls exist in this modal

    renderTicketList(ticketsToRender = this.tickets) {
        const ticketData = ticketsToRender.map(ticket => ({
            ...ticket,
            createdDateFormatted: new Date(ticket._createdDate).toLocaleDateString(),
            lastUpdatedFormatted: new Date(ticket.lastUpdated).toLocaleDateString(),
            priorityClass: this.getPriorityClass(ticket.priority),
            statusClass: this.getStatusClass(ticket.status)
        }));
        
        $w('#ticketList').data = ticketData;
    }

    getPriorityClass(priority) {
        const classes = {
            'Low': 'priority-low',
            'Medium': 'priority-medium',
            'High': 'priority-high',
            'Critical': 'priority-critical'
        };
        return classes[priority] || 'priority-medium';
    }

    getStatusClass(status) {
        const classes = {
            'Open': 'status-open',
            'In Progress': 'status-progress',
            'Resolved': 'status-resolved',
            'Closed': 'status-closed'
        };
        return classes[status] || 'status-open';
    }

    updateSummaryCards(tickets) {
        const totalTickets = tickets.length;
        const openTickets = tickets.filter(ticket => ticket.status === 'Open').length;
        const inProgressTickets = tickets.filter(ticket => ticket.status === 'In Progress').length;
        const resolvedTickets = tickets.filter(ticket => ticket.status === 'Resolved').length;
        
        // Update summary cards
        $w('#cardNumberTotal').text = totalTickets.toString();
        $w('#textOpenTickets').text = openTickets.toString();
        $w('#textInProgressTickets').text = inProgressTickets.toString();
        $w('#textResolvedTickets').text = resolvedTickets.toString();
    }

    async refreshTickets() {
        await this.loadTickets();
        this.renderTicketList();
        this.updateSummaryCards(this.tickets);
    }

    // Removed notification methods as no notification elements exist

    // Removed export functionality as no export button exists
}

// Initialize the ticket manager when page loads
$w.onReady(() => {
    const ticketManager = new TicketManager();
    
    // Make it globally accessible for debugging
    window.ticketManager = ticketManager;
});

// Export for use in other modules
export { TicketManager };