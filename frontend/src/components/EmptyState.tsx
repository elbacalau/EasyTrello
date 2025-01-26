import {
  CalendarIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline'

const items = [
  {
    title: 'Crear un Calendario',
    description: 'Mantente al tanto de tus plazos, o no — tú decides.',
    icon: CalendarIcon,
    background: 'bg-yellow-500',
  },
  {
    title: 'Crear un Tablero',
    description: 'Organiza tareas en diferentes etapas de tu proyecto.',
    icon: ViewColumnsIcon,
    background: 'bg-blue-500',
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function EmptyState() {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900">Proyectos</h2>
      <p className="mt-1 text-sm text-gray-500">
        Aún no has creado un proyecto. Comienza seleccionando una plantilla o empieza desde un proyecto vacío.
      </p>
      <ul role="list" className="mt-6 grid grid-cols-1 gap-6 border-t border-b border-gray-200 py-6 sm:grid-cols-2">
        {items.map((item, itemIdx) => (
          <li key={itemIdx} className="flow-root">
            <div className="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-gray-50">
              <div
                className={classNames(item.background, 'flex size-16 shrink-0 items-center justify-center rounded-lg')}
              >
                <item.icon aria-hidden="true" className="size-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  <a href="#" className="focus:outline-hidden">
                    <span aria-hidden="true" className="absolute inset-0" />
                    <span>{item.title}</span>
                    <span aria-hidden="true"> &rarr;</span>
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex">
        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          O empieza desde un proyecto vacío
          <span aria-hidden="true"> &rarr;</span>
        </a>
      </div>
    </div>
  )
}
