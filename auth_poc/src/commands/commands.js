

export const Office = window.Office

export async function criarPedido(event) {
    try {
        Office.context.ui.displayDialogAsync('https://localhost:3000/criarPedido', {height: 80, width: 80, displayInIframe: true});        //Office.context.ui.displayDialogAsync('', {height: 30, width: 20})
    } catch (error) {
        console.log('Erro:', error.message)
        console.error(error)
    }
    finally {
        event.completed()
    }
}

Office.actions.associate("criarPedido", criarPedido)