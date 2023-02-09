
import { criarPedido } from "../../commands/commands"

function PainelPage(){
    return(
        <>
            <div>
                Painel teste
            </div>
            <div>
                <button onClick={criarPedido}>Criar pedido</button>
            </div>
        </>
    )
}

export default PainelPage