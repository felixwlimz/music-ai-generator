// Example usage of toast notifications with sonner
// Import this in your components:
// import { toast } from "sonner"

// Basic toast
// toast("Event has been created")

// Toast with description
// toast("Event has been created", {
//   description: "Sunday, December 03, 2023 at 9:00 AM",
// })

// Success toast
// toast.success("Event has been created")

// Error toast
// toast.error("Event has not been created")

// Warning toast
// toast.warning("Event has a warning")

// Info toast
// toast.info("Be at the area 10 minutes before the event time")

// Toast with action
// toast("Event has been created", {
//   action: {
//     label: "Undo",
//     onClick: () => console.log("Undo"),
//   },
// })

// Promise toast (for async operations)
// toast.promise(promise, {
//   loading: 'Loading...',
//   success: (data) => {
//     return `${data.name} has been added`;
//   },
//   error: 'Error',
// });

export {}
