<?php

namespace App\Http\Controllers;
use App\Models\Task;
use App\Models\TaskList;
use Inertia\Inertia;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Task::with('list') - Esto le dice a Eloquent que cargue también la relación list de cada tarea, en una sola query SQL.
        //Por eso en React podés hacer directamente: task.list.title
        $query = Task::with('list')->whereHas('list', function ($query) {
            // whereHas('list') //filtra las tareas  q pertenecen auna lista. Es decir traera solo tareas q esten en una lista
            $query->where('user_id', auth()->id());
        })->orderBy('created_at', 'desc');

        if (request()->has('search')) { // si la solicitud HTTP (request()) contiene el parámetro search
            $search = request('search');
            // La palabra clave USE permite que la variable $search esté disponible dentro de la función anónima(SUBCONSULTA)
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}")
                    ->orWhere('description', 'like', "%{$search}");
            });
            /*traudccion: SELECT * FROM tasks
            WHERE title LIKE '%task%'
            OR description LIKE '%task%'; */
        }

        if (request()->has('filter') && request('filter') !== 'all') {
            $query->where('is_completed', request('filter') == 'completed');
        }

        $tasks = $query->paginate(10);
        $lists = TaskList::where('user_id', auth()->id())->get();
        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'lists' => $lists,
            'filters' => [
                'search' => request('search', ''),
                'filter' => request('filter', ''),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate(([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'list_id' => 'required|exists:lists,id',
            'is_completed' => 'boolean'
        ]));

        Task::create(
            $validated
        );

        return redirect()->route('tasks.index')->with('success', 'Task Created Successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate(([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'list_id' => 'required|exists:lists,id',
            'is_completed' => 'boolean'
        ]));

        $task->update(
            $validated
        );

        return redirect()->route('tasks.index')->with('success', 'Task Updated Successfully');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->route('tasks.index')->with('success', 'Task Deleted Successfully');

    }
}
