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
        this.updateStatistics();
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
            this.showNotification('Failed to load tickets', 'error');
        }
    }

    setupEventListeners() {
        // Modal close button
        $w('#btnCloseModal').onClick(() => this.hideModal());
        
        // Ticket list item clicks - setup repeater
        $w('#repeaterTickets').onItemReady(($item, itemData) => {
            // Populate ticket data in repeater items
            $item('#textTicketId').text = itemData._id || itemData.ticketId;
            $item('#textTicketTitle').text = itemData.title;
            $item('#textTicketDescription').text = itemData.description;
            $item('#textSubmittedBy').text = itemData.submittedBy || itemData.submitterEmail;
            $item('#textTicketDate').text = itemData.createdDateFormatted || new Date(itemData._createdDate).toLocaleDateString();
            $item('#textTicketStatus').text = itemData.status;
            $item('#textTicketPriority').text = itemData.priority;
        });
    }

    hideModal() {
        $w('#containerTicketManagement').hide();
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
        
        $w('#repeaterTickets').data = ticketData;
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

    updateStatistics() {
        const stats = {
            total: this.tickets.length,
            open: this.tickets.filter(t => t.status === 'Open').length,
            inProgress: this.tickets.filter(t => t.status === 'In Progress').length,
            resolved: this.tickets.filter(t => t.status === 'Resolved').length
        };
        
        $w('#textTotalTickets').text = stats.total.toString();
        $w('#textOpenTickets').text = stats.open.toString();
        $w('#textInProgressTickets').text = stats.inProgress.toString();
        $w('#textResolvedTickets').text = stats.resolved.toString();
    }

    async refreshTickets() {
        await this.loadTickets();
        this.renderTicketList();
        this.updateStatistics();
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