The modules in these functions should return **only**
subclasses of HTMLElement (typically HTMLDivElement).

They should never ever manage any kind of state nor
produce any direct side effects.

They are allowed to accept callbacks for things like
click handlers.  Those callbacks should always be
void functions with very few arguments.  The event
handlers may also do simple things like re-styling
the element in place and calling stopPropagation
or preventDefault. Be judicious about these, please.
There is no harm in building dom objects elsewhere
as needed.
