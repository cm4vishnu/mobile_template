"use client"

import * as React from "react"
import {
  Command as CommandComponent,
  type CommandProps,
  Group,
  Empty,
  Favicon,
  Input,
  Item,
  List,
  ScrollArea,
  Separator,
  Shortcut,
} from "cmdk"
import { cn } from "@/lib/utils"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandComponent>,
  CommandProps
>(({ className, children, ...props }, ref) => (
  <CommandComponent
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col rounded-md bg-popover text-popover-foreground shadow-md",
      className,
    )}
    {...props}
  >
    <CommandComponent.List className="flex-1 overflow-auto">
      {children}
    </CommandComponent.List>
  </CommandComponent>
))
Command.displayName = CommandComponent.displayName

Command.Input = function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "flex h-9 w-full rounded-md border bg-input px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}
Command.Input.displayName = "CommandInput"

Command.List = function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof List>) {
  return (
    <List
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}
Command.List.displayName = "CommandList"

Command.Group = function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof Group>) {
  return (
    <Group
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}
Command.Group.displayName = "CommandGroup"

Command.Empty = function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof Empty>) {
  return (
    <Empty
      className={cn("py-6 text-center text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}
Command.Empty.displayName = "CommandEmpty"

Command.Favicon = function CommandFavicon({
  className,
  ...props
}: React.ComponentProps<typeof Favicon>) {
  return (
    <Favicon
      className={cn("mr-2 h-4 w-4", className)}
      {...props}
    />
  )
}
Command.Favicon.displayName = "CommandFavicon"

Command.Item = function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof Item>) {
  return (
    <Item
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  )
}
Command.Item.displayName = "CommandItem"

Command.Shortcut = function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<typeof Shortcut>) {
  return (
    <Shortcut
      className={cn(
        "ml-auto text-xs tracking-widtext-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}
Command.Shortcut.displayName = "CommandShortcut"

export { Command }